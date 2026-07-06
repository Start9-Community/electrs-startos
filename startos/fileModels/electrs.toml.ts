import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const shape = z.object({
  cookie_file: z.literal('/mnt/bitcoind/.cookie').catch('/mnt/bitcoind/.cookie'),
  // Dynamic: main.ts writes bitcoind's LXC-bridge host:port at startup (see
  // bitcoindBridge in utils.ts). Loosened from a literal so the resolved bridge
  // address can be merged in; the catch is a loopback placeholder that just
  // fails connection (never a routable address) until that write lands.
  daemon_rpc_addr: z.string().catch('127.0.0.1:8332'),
  daemon_p2p_addr: z.string().catch('127.0.0.1:8333'),
  network: z.literal('bitcoin').catch('bitcoin'),
  electrum_rpc_addr: z
    .literal('0.0.0.0:50001')
    .catch('0.0.0.0:50001'),
  log_filters: z
    .enum(['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'])
    .catch('INFO'),
  index_batch_size: z.number().int().optional().catch(undefined),
  index_lookup_limit: z.number().int().optional().catch(undefined),
})

export const tomlFile = FileHelper.toml(
  {
    base: sdk.volumes.main,
    subpath: 'electrs.toml',
  },
  shape,
)
