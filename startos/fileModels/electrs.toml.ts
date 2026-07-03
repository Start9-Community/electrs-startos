import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const shape = z.object({
  cookie_file: z.literal('/mnt/bitcoind/.cookie').catch('/mnt/bitcoind/.cookie'),
  // Dynamic: written to bitcoind's LXC-bridge address at runtime (see main.ts).
  // Loosened from a literal so the resolved bridge host:port can be merged in;
  // the catch keeps the legacy value as a fallback.
  daemon_rpc_addr: z.string().catch('bitcoind.startos:8332'),
  daemon_p2p_addr: z.string().catch('bitcoind.startos:8333'),
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
