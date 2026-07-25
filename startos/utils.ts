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
 * bitcoind's RPC and P2P endpoints over the LXC bridge, for electrs.toml's
 * `daemon_rpc_addr` / `daemon_p2p_addr`. Two reactive bridge-address watches —
 * one per bitcoind host — each chained `.const()`, so main restarts only when
 * that address actually changes: a bitcoind update is 0 restarts, bitcoind
 * installed after electrs is one healing restart, and uninstall is one restart.
 * Each resolves null while bitcoind is absent; the caller omits the toml field
 * rather than writing a placeholder, so the `.const()` heals in the real
 * address once bitcoind appears.
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
      hostId: btcPeerHostId,
      internalPort: btcPeerPortInternal,
    })
    .const()
  return { rpc, p2p }
}
