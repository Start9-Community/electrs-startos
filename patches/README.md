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
