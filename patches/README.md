# Carried patches

Deltas applied to the `electrs` submodule at build time, in filename order, by the
`patch -p1 --fuzz=0` step in the [Dockerfile](../Dockerfile). `--fuzz=0` is deliberate: after a
submodule bump a patch whose context has changed must fail the build, not apply anyway with the
mismatch ignored.

Each patch here is a liability — it forks the shipped binary from the upstream tag the submodule
names, and every electrs bump has to re-validate it. Add one only when the alternative is shipping
a known defect, and record below what retires it.

## 0001 — bound client writes so a wedged peer cannot stall the server

**Retire when:** upstream sets a write timeout (or makes the response write non-blocking) and the
submodule is bumped past it. Tracked upstream at
[romanz/electrs#1326](https://github.com/romanz/electrs/issues/1326), filed with the diagnosis
below and this patch's approach; [#745](https://github.com/romanz/electrs/issues/745) is the same
defect reported in 2022. Neither `v0.11.1` (the current pin) nor `master` sets a timeout as of
2026-08-07; there is no upstream tag newer than `v0.11.1`. Issue #85 lists every file a retirement
has to touch.

electrs writes Electrum responses from `handle_events`, which runs inline on the single `serve()`
loop — the same loop that calls `rpc.sync()`. `Peer::send` uses a blocking `write_all`, and no
socket in the tree sets `SO_SNDTIMEO`. So a client that stops draining its receive window — gone
without a FIN, suspended, or behind a stalled proxy — holds that loop for as long as the kernel
keeps retransmitting. Indexing stops, every other client stops being served, and the process is
too wedged to answer SIGTERM, so a stop falls through to SIGKILL after the grace period.

It self-heals only when the kernel finally errors the socket, at which point the existing error
path logs `disconnecting due to failed to send response` and drops that peer. Observed in the
field at 19 minutes, 1h43m, 1h55m, 3h32m and 8h39m, on two unrelated servers (aarch64 and x86_64),
each time ending in a burst of those disconnects followed immediately by a catch-up batch of every
block missed. Users read the frozen server as "stuck resyncing"; one reinstalled and lost a 62 GB
index to a 23-hour rebuild that was never needed.

The patch sets a 60s `SO_SNDTIMEO` on each accepted socket. That is a per-`write`-syscall deadline,
not a per-response one, so a slow-but-draining client resets it on every partial write and is never
dropped — only a peer that accepts nothing at all for a full minute trips it. Brief application
pauses don't qualify: the client's kernel keeps accepting into its receive buffer while the
application is busy. What does qualify is a peer that is gone entirely, or a live one whose
application has stopped reading for long enough to fill that buffer and hold its window shut for
the whole minute — that client is disconnected by design and simply reconnects, the ordinary cost
of not letting it freeze the server for everyone else. When the timeout trips, `write_all` returns
the error and the existing path disconnects exactly that peer, leaving the server loop free.

Because the deadline is per-syscall, it bounds a wedged peer at a small **multiple** of 60s rather
than at 60s. Measured on loopback against a peer that never reads, using a 3s stand-in for the
value: `write` returned partial counts twice — 2.6 MB, then 95 KB as the peer's receive buffer
auto-tuned upward — each after blocking a full period, and only the third call saw the whole period
pass with zero bytes and returned `WouldBlock`. Total 9.1s for a 3s timeout, so expect a couple of
minutes at 60s. That is the ceiling the patch buys against the 19m–8h39m it replaces, not a 60s one.
The same harness confirms the other half: a peer draining slowly but steadily accepted 64 MB over
28s without the timeout ever firing.

## 0002 — route blocks below bitcoind's prune height to RPC

**Retire when:** upstream supports pruned nodes and the submodule is bumped past it. Authored by
[paulscode](https://github.com/paulscode/electrs-pruned), whose repo carries the measurements and
the design rationale; upstream refuses to start against a pruned node, requested since 2022 in
[romanz/electrs#673](https://github.com/romanz/electrs/issues/673).

Deleting upstream's `bail!("electrs requires non-pruned bitcoind node")` on its own makes things
worse, not better. bitcoind answers a `getdata` for a block it has pruned with **silence** — no
block, no `notfound`, no disconnect — and `Connection::for_blocks` consumes replies positionally on
an untimed blocking `recv`. A batch entirely below the prune height hangs forever; one straddling it
fails with a misleading `got unexpected block` as replies shift out of position. There is no error
to detect, so there is no fallback to trigger: the routing has to be decided before asking.

`getblockchaininfo.pruneheight` decides it exactly — bitcoind serves every block at or above it and
none below. `for_blocks` walks a batch as maximal runs of same-availability blocks, sending retained
runs down the existing single-`getdata` p2p path and pruned runs to `getblock <hash> 0`, the
verbosity `btc-rpc-proxy` intercepts and satisfies from peers. Runs rather than a partition, so each
keeps streaming in the caller's order without buffering the batch.

p2p stays because it has to: a peer fetch costs ~162 ms on clearnet and ~2118 ms over Tor, flat in
block size because it is round-trip-bound, so a full chain over RPC alone is ~40 hours on clearnet
and ~22 days over Tor. RPC is for the blocks bitcoind cannot serve, not a replacement for the ones
it can.

Archival nodes take an early return in `for_blocks_with` and are byte-for-byte unchanged.

## 0003 — retry pruned-block RPCs, with separate budgets per caller

**Retire when:** 0002 does, since it only guards that path.

A pruned node's block source is a separate process — `btc-rpc-proxy`, which restarts whenever
bitcoind updates — and individual peer fetches fail transiently. Either took indexing down, because
the error propagates out of `Index::sync` and ends the process. Retries use exponential backoff (1s
doubling to 30s), waiting in short slices so the exit flag is still observed promptly.

The two budgets are load-bearing. `handle_events` and `rpc.sync()` share one thread, so a query that
waits freezes indexing and every other client with it: an earlier single 300s budget meant one query
against a downed proxy froze the server for five minutes. Indexing keeps 300s, where stalling beats
dying; serving gets 10s, where a prompt error the wallet can retry beats a freeze.
