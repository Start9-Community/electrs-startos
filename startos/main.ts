import { FileHelper } from '@start9labs/start-sdk'
import { manifest } from 'bitcoin-core-startos/startos/manifest'
import { tomlFile } from './fileModels/electrs.toml'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { bitcoindBridge, port } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   */
  console.info(i18n('Starting Electrs!'))

  let syncNotified =
    (await storeJson.read((s) => s.syncNotified).once()) ?? false
  let everSynced = (await storeJson.read((s) => s.everSynced).once()) ?? false

  // bitcoind's RPC + P2P over the LXC bridge, written into electrs.toml before
  // the daemon reads it. Resolved reactively (see bitcoindBridge): the bridge
  // address changes only on bitcoind install / uninstall / port-change, so main
  // re-fires and restarts electrs to heal on those — and never on a plain
  // bitcoind update. While bitcoind is absent each resolves null and we omit the
  // field, letting electrs fail to connect until the .const() heals it in.
  const bitcoind = await bitcoindBridge(effects)
  await tomlFile.merge(effects, {
    ...(bitcoind.rpc && { daemon_rpc_addr: bitcoind.rpc }),
    ...(bitcoind.p2p && { daemon_p2p_addr: bitcoind.p2p }),
  })

  const electrsContainer = sdk.SubContainer.of(
    effects,
    { imageId: 'electrs' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      })
      .mountDependency<typeof manifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: '/mnt/bitcoind',
        readonly: true,
      }),
    'electrs',
  )

  // Restart only when bitcoind writes a replacement cookie — an absent cookie
  // means bitcoind is down.
  const rootfs = await electrsContainer.rootfs
  await FileHelper.string(`${rootfs}/mnt/bitcoind/.cookie`)
    .read(
      (cookie) => cookie,
      (prev, next) => next === null || prev === next,
    )
    .const(effects)

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects)
    .addDaemon('electrs', {
      subcontainer: electrsContainer,
      exec: { command: ['electrs'] },
      ready: {
        display: i18n('Electrum Server'),
        fn: async () => {
          // checkPortListening reads /proc/net/tcp* — it succeeds as soon as
          // electrs binds the Electrum port, which it does at startup BEFORE
          // blocking on the bitcoind IBD wait (electrs/src/server.rs binds the
          // listener before Rpc::new connects to bitcoind). So the port is open
          // throughout that wait; a not-listening result just means electrs hasn't
          // bound the socket yet — it's still starting, not blocked on bitcoind.
          const result = await sdk.healthCheck.checkPortListening(
            effects,
            port,
            {
              successMessage: i18n(
                'Electrum server is ready and accepting connections',
              ),
              errorMessage: i18n('Electrum server is starting'),
            },
          )

          return result.result === 'success'
            ? result
            : {
                result: 'starting',
                message: i18n('Electrum server is starting'),
              }
        },
      },
      requires: [],
    })
    .addHealthCheck('sync', {
      ready: {
        display: i18n('Sync Progress'),
        fn: async () => {
          // Probe electrs's Electrum RPC with server.banner. Until the index is
          // ready, electrs replies with {"code": -32603, "message": "unavailable
          // index"} — but far more often during a build it does not reply at all
          // within the timeout, because its sync loop indexes a whole ~2000-block
          // batch (~2 min each) before servicing any RPC and only answers between
          // batches (electrs/src/server.rs `while server_rx.is_empty()`).
          //
          // So sync must be confirmed POSITIVELY — only a real JSON-RPC `result`
          // counts as synced. A read timeout must fail the script (`|| exit`),
          // otherwise the trailing printf's exit code masks it and an empty reply
          // is misread as synced, reporting "Fully synced" all through the build.
          const probe = `exec 3<>/dev/tcp/127.0.0.1/${port} || exit 1
printf '%s\\n' '{"jsonrpc":"2.0","id":1,"method":"server.banner","params":[]}' >&3
IFS= read -t 10 -r line <&3 || exit 2
exec 3<&- 2>/dev/null
printf '%s' "$line"`

          // Before the first success a non-answer is the norm, so one attempt
          // says all it can. Afterwards it is surprising enough to be worth
          // re-asking: on modest hardware indexing a single block, or the
          // RocksDB compaction behind it, blocks the RPC loop past the read
          // timeout, and one such blip is not evidence of a sync regression.
          for (let attempt = everSynced ? 3 : 1; attempt > 0; attempt--) {
            const res = await electrsContainer.exec(['bash', '-c', probe], {})

            if (
              res.exitCode === 0 &&
              res.stdout.toString().includes('"result"')
            ) {
              if (!everSynced) {
                await storeJson.merge(effects, { everSynced: true })
                everSynced = true
              }
              return { message: i18n('Fully synced'), result: 'success' }
            }
          }

          // A built index is never rebuilt, so past the first success the
          // build message would promise a fully-synced user hours of work
          // that is not happening — and send them to reindex a good index.
          return {
            message: everSynced
              ? i18n(
                  'Electrs is not responding. It is likely busy indexing; this usually clears on its own.',
                )
              : i18n(
                  'Electrs is building its address index. This can take several hours on first run.',
                ),
            result: 'loading',
          }
        },
      },
      requires: ['electrs'],
    })
    .addOneshot('synced-true', {
      subcontainer: null,
      exec: {
        fn: async () => {
          // The SDK re-fires this oneshot every time the sync health check
          // dips out of success and recovers (TCP probe blips). The closure
          // flag is the source of truth within a main lifecycle; the on-disk
          // flag re-seeds it on next startup.
          if (syncNotified) return null
          await sdk.notification.create(effects, {
            level: 'success',
            title: i18n('Sync Complete'),
            message: i18n(
              'Electrs has finished building its address index. The Electrum server is ready.',
            ),
          })
          await storeJson.merge(effects, { syncNotified: true })
          syncNotified = true
          return null
        },
      },
      requires: ['sync'],
    })
})
