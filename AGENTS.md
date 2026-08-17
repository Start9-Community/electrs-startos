# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **P2P must resolve bitcoind's `peer-local` host, never `peer`.** electrs pulls whole blocks over p2p — for the index, and again for every `blockchain.scripthash.get_history` on a scripthash the client never subscribed to. `peer` maps onto bitcoind's plain `bind`, shared with anonymous inbound peers, where the connection earns no permissions: bitcoind may evict it to seat another peer, or cut it off under `maxuploadtarget`. **electrs does not reconnect p2p** — `p2p_loop` exiting drops `new_block_send` and takes the process down by design — so one drop is a restart, and under a client polling unsubscribed scripthashes it is a restart loop. `peer-local` is a bridge-only binding onto bitcoind's `whitebind` listener, which grants `noban` + `download`. That host is why `dependencies.ts` gates bitcoind on the revision that introduced it.
- **Omit the address rather than defaulting it while bitcoind is unresolved.** The toml fields are `z.string().optional()` precisely so they can be absent until the reactive read heals them in.
- **Don't set `auth` in `electrs.toml`.** electrs exits if `auth` and `cookie_file` are both present; the model pins `auth` to undefined for that reason.
- **The sync check must confirm success positively, and a read timeout must fail the probe.** During an index build electrs services no RPC for minutes at a time (`server.rs`'s `while server_rx.is_empty()`), so a non-answer is the norm — without the `|| exit`, the trailing `printf`'s exit code masks the timeout and an empty reply reads as synced, reporting "Fully synced" all through the build.
- **Don't name a literal external port in docs.** StartOS assigns it and never changes it for an existing binding, so it is per-server — `start-cli package host binding list electrs electrum` reads the live value.
