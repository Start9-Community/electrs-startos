import { T, utils } from '@start9labs/start-sdk'
import {
  peerHostId as btcPeerHostId,
  peerInterfaceId as btcPeerInterfaceId,
  rpcHostId as btcRpcHostId,
  rpcInterfaceId as btcRpcInterfaceId,
} from 'bitcoin-core-startos/startos/utils'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const port = 50001

export const logFilters = {
  ERROR: i18n('Error'),
  WARN: i18n('Warning'),
  INFO: i18n('Info'),
  DEBUG: i18n('Debug'),
  TRACE: i18n('Trace'),
}

export type LogFilters = keyof typeof logFilters

/**
 * The IPv4 LXC-bridge `host:port` for an interface on an already-resolved
 * `FilledHost`. Pure — call it INSIDE a `sdk.host` map fn so `.const()` narrows
 * its reactivity to just this address. `.startos` / direct container IPs are
 * deprecated; containers reach each other over this bridge. `ssl` narrows to the
 * http vs https variant when an interface exposes both.
 */
const bridgeAddr = (
  host: utils.FilledHost | null,
  interfaceId: string,
  ssl?: boolean,
) => {
  const iface =
    host &&
    Object.values(host.bindings)
      .flatMap((b) => Object.values(b.interfaces))
      .find((i) => i.id === interfaceId)
  const h =
    iface &&
    iface.addressInfo
      .filter({
        kind: 'bridge',
        predicate: (hn) =>
          hn.metadata.kind === 'ipv4' && (ssl === undefined || hn.ssl === ssl),
      })
      .hostnames[0]
  return h && h.port != null ? `${h.hostname}:${h.port}` : undefined
}

/**
 * bitcoind's RPC and P2P endpoints over the LXC bridge, for electrs.toml's
 * `daemon_rpc_addr` / `daemon_p2p_addr` (replaces the deprecated
 * `bitcoind.startos:8332` / `bitcoind.startos:8333`). One subscription per
 * bitcoind host, each returning only its resolved address so the caller re-runs
 * just when a value it uses changes. Either field is `undefined` until the
 * dependency's interface is available.
 */
export const bitcoindBridge = async (effects: T.Effects) => {
  const rpc = await sdk.host
    .get(effects, { hostId: btcRpcHostId, packageId: 'bitcoind' }, (host) =>
      bridgeAddr(host, btcRpcInterfaceId, false),
    )
    .const()
  const p2p = await sdk.host
    .get(effects, { hostId: btcPeerHostId, packageId: 'bitcoind' }, (host) =>
      bridgeAddr(host, btcPeerInterfaceId),
    )
    .const()
  return { rpc, p2p }
}
