import { T } from '@start9labs/start-sdk'
import {
  peerHostId as btcPeerHostId,
  peerPortInternal as btcPeerPortInternal,
  rpcHostId as btcRpcHostId,
  rpcPort as btcRpcPort,
} from 'bitcoin-core-startos/startos/utils'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const port = 50001

// Host id electrs binds its Electrum interface on. Exported so dependents
// (mempool/specter/canary) resolve electrs over the bridge without a literal.
export const electrumHostId = 'electrum'

export const logFilters = {
  ERROR: i18n('Error'),
  WARN: i18n('Warning'),
  INFO: i18n('Info'),
  DEBUG: i18n('Debug'),
  TRACE: i18n('Trace'),
}

export type LogFilters = keyof typeof logFilters

/**
 * Bridge address (`10.0.3.1:<assigned external port>`) of a dependency's
 * binding, as a minimal reactive value. Chain `.const()` in main: the mapped
 * string only changes when the address itself does, so main restarts exactly
 * on dependency install/uninstall/port-change and never on dependency
 * updates. Chain `.once()` in an action context. `fallbackPort` keeps the
 * value non-null while the dependency is absent — sanctioned only for tor's
 * allocator-guaranteed SOCKS 9050. Drop-in for the planned SDK
 * `sdk.host.getBridgeAddress` helper.
 */
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort: number
  },
): { const(): Promise<string>; once(): Promise<string> }
export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
): { const(): Promise<string | null>; once(): Promise<string | null> }
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort?: number
  },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port =
          host?.bindings[opts.internalPort]?.net.assignedPort ??
          opts.fallbackPort
        return port != null ? `${osIp}:${port}` : null
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

/**
 * bitcoind's RPC and P2P endpoints over the LXC bridge, for electrs.toml's
 * `daemon_rpc_addr` / `daemon_p2p_addr`. Two reactive bridge-address watches —
 * one per bitcoind host — each chained `.const()`, so main restarts only when
 * that address actually changes: a bitcoind update is 0 restarts, bitcoind
 * installed after electrs is one healing restart, and uninstall is one restart
 * back to the placeholder. While bitcoind is absent each resolves null and we
 * fall back to a dead loopback address (matching the toml catch defaults) that
 * just fails to connect until the `.const()` heals.
 */
export const bitcoindBridge = async (effects: T.Effects) => {
  const rpc = await bridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcRpcHostId,
    internalPort: btcRpcPort,
  }).const()
  const p2p = await bridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcPeerHostId,
    internalPort: btcPeerPortInternal,
  }).const()
  return {
    rpc: rpc ?? '127.0.0.1:8332',
    p2p: p2p ?? '127.0.0.1:8333',
  }
}
