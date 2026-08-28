# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

Mechanism is in [`README.md`](README.md); these are the things to not do.

- **Resolve bitcoind's `peer-local` host for p2p, never `peer`.** A drop on the ordinary listener is a restart, and under a client polling unsubscribed scripthashes a restart loop. (README § Dependencies.)
- **Don't make the prune-height split reactive.** There is no error to detect — bitcoind answers a `getdata` for a pruned block with silence — so `patches/0002` decides before asking. Any "try p2p, fall back" rewrite hangs forever.
- **Don't drop `main.ts`'s `.cookie` watch, or replace it with a per-batch prune re-read.** `Daemon.pruned` is latched at connect, and that watch is the only thing that carries a pruning toggle through.
- **Omit an address rather than defaulting it while bitcoind is unresolved.** The toml fields are `z.string().optional()` so they can be absent until the reactive read heals them in.
- **Don't set `auth` in `electrs.toml`.** electrs exits if `auth` and `cookie_file` are both present.
- **Keep the sync check's `|| exit`.** Without it the trailing `printf`'s exit code masks a read timeout, and an empty reply reads as synced — which it is for minutes at a time during an index build.
- **Don't name a literal external port in docs.** StartOS assigns it per server; `start-cli package host binding list electrs electrum` reads the live value.
