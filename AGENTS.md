# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `electrs`.** Hard dependency on `bitcoind` (an archival node — a critical task disables pruning via `prune: 0`); mounts bitcoind's volume read-only at `/mnt/bitcoind` for cookie auth.
- **bitcoind is reached over the LXC bridge**, not `.startos` DNS. `bitcoindBridge` in `startos/utils.ts` resolves bitcoind's RPC and P2P `host:port` through the shared `bridgeAddress` helper — the OS bridge IP (`sdk.getOsIp`) plus the assigned external port of bitcoind's `rpcHostId`/`peerHostId` bindings (keyed by the exported internal ports `rpcPort`/`peerPortInternal`, imported from `bitcoin-core-startos/startos/utils`) — and `main.ts` writes them into `electrs.toml` before the daemon starts. Each host is a reactive `.const()` watch on just its mapped bridge address (doctrine v3): a plain bitcoind **update** is 0 restarts, bitcoind **installed** after electrs is one healing restart, and **uninstall** is one restart back to the placeholder. While bitcoind is absent the helper resolves null and `bitcoindBridge` falls back to a dead loopback placeholder (`127.0.0.1:8332`/`127.0.0.1:8333`, matching the toml catch defaults) that just fails to connect until the `.const()` heals. The file model types `daemon_rpc_addr`/`daemon_p2p_addr` loosely (`z.string()` with those loopback-placeholder catches) because the address is resolved at runtime.
- **The Electrum interface is SSL-only.** `interfaces.ts` binds only the TLS port (50002, StartOS-terminated); the plain-TCP port 50001 is the internal daemon bind and is never exposed externally.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach electrs -n electrs -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `electrs`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
