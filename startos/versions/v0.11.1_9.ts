import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { LogFilters } from '../utils'

export const v_0_11_1_9 = VersionInfo.of({
  version: '0.11.1:9',
  releaseNotes: {
    en_US:
      'Internal updates (start-sdk 2.0.x). Electrs now reaches Bitcoin over the internal network bridge and no longer restarts when Bitcoin is updated.',
    es_ES:
      'Actualizaciones internas (start-sdk 2.0.x). Electrs ahora accede a Bitcoin a través del puente de red interno y ya no se reinicia cuando Bitcoin se actualiza.',
    de_DE:
      'Interne Aktualisierungen (start-sdk 2.0.x). Electrs erreicht Bitcoin jetzt über die interne Netzwerk-Bridge und startet nicht mehr neu, wenn Bitcoin aktualisiert wird.',
    pl_PL:
      'Aktualizacje wewnętrzne (start-sdk 2.0.x). Electrs łączy się teraz z Bitcoin przez wewnętrzny mostek sieciowy i nie uruchamia się ponownie, gdy Bitcoin jest aktualizowany.',
    fr_FR:
      'Mises à jour internes (start-sdk 2.0.x). Electrs atteint désormais Bitcoin via le pont réseau interne et ne redémarre plus lorsque Bitcoin est mis à jour.',
  },
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      const configYaml:
        | {
            'log-filters': LogFilters
            'index-batch-size': number
            'index-lookup-limit': number
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        // daemon_rpc_addr/daemon_p2p_addr are owned by main.ts (resolved bridge
        // addresses); omit them here so no placeholder/legacy name is persisted.
        await tomlFile.merge(effects, {
          cookie_file: '/mnt/bitcoind/.cookie',
          electrum_rpc_addr: '0.0.0.0:50001',
          network: 'bitcoin',
          log_filters: configYaml['log-filters'],
          index_batch_size: configYaml['index-batch-size'],
          index_lookup_limit: configYaml['index-lookup-limit'],
        })

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
