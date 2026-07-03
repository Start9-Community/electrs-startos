# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `electrs`.** Hard dependency on `bitcoind` (an archival node — a critical task disables pruning via `prune: 0`); mounts bitcoind's volume read-only at `/mnt/bitcoind` for cookie auth.
- **bitcoind is reached over the LXC bridge**, not `.startos` DNS. `bitcoindBridge` in `startos/utils.ts` resolves bitcoind's RPC and P2P `host:port` from bitcoin-core's exported `rpcHostId`/`rpcInterfaceId` and `peerHostId`/`peerInterfaceId` (imported from `bitcoin-core-startos/startos/utils`), and `main.ts` writes them into `electrs.toml` before the daemon starts — so main re-fires and restarts electrs if bitcoind's bridge address changes. The file model deliberately types `daemon_rpc_addr`/`daemon_p2p_addr` loosely (`z.string()` with legacy `bitcoind.startos:*` catches) because the address is dynamic.
- **The Electrum interface is SSL-only.** `interfaces.ts` binds only the TLS port (50002, StartOS-terminated); the plain-TCP port 50001 is the internal daemon bind and is never exposed externally.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach electrs -n electrs -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `electrs`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
