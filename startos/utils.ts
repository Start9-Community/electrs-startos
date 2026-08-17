import { T } from '@start9labs/start-sdk'
import {
  peerLocalHostId as btcPeerLocalHostId,
  peerPortLocal as btcPeerPortLocal,
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
 * bitcoind's RPC and P2P endpoints over the LXC bridge, for electrs.toml's
 * `daemon_rpc_addr` / `daemon_p2p_addr`. Two reactive bridge-address watches —
 * one per bitcoind host — each chained `.const()`, so main restarts only when
 * that address actually changes: a bitcoind update is 0 restarts, bitcoind
 * installed after electrs is one healing restart, and uninstall is one restart.
 * Each resolves null while bitcoind is absent; the caller omits the toml field
 * rather than writing a placeholder, so the `.const()` heals in the real
 * address once bitcoind appears.
 *
 * P2P resolves bitcoind's `peer-local` host, not `peer`. electrs fetches whole
 * blocks over p2p — for the index, and again for every history query on a
 * scripthash no client has subscribed to — and `peer` maps onto the plain
 * `bind` that anonymous inbound peers share, where that traffic earns no
 * permissions: bitcoind may evict the connection to seat another peer, or cut
 * it off under `maxuploadtarget`. electrs does not reconnect p2p; it exits.
 * `peer-local` is whitelisted (noban + download), so neither applies.
 *
 * Always resolve through getBridgeAddress rather than rebuilding an address
 * from `net.assignedPort`/`assignedSslPort`: which of those is populated is a
 * property of how bitcoind bound the port, not something to infer here.
 */
export const bitcoindBridge = async (effects: T.Effects) => {
  const rpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: btcRpcHostId,
      internalPort: btcRpcPort,
      ssl: false,
    })
    .const()
  const p2p = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: btcPeerLocalHostId,
      internalPort: btcPeerPortLocal,
    })
    .const()
  return { rpc, p2p }
}
