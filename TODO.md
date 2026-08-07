# TODO

## Retire the carried write-timeout patch once upstream fixes this

Reported upstream as [romanz/electrs#1326](https://github.com/romanz/electrs/issues/1326),
which carries the diagnosis, the field evidence and the proposed fix;
[#745](https://github.com/romanz/electrs/issues/745) is the same defect reported in 2022 and
may be closed as a duplicate of it. Watch #1326.

Retire when upstream sets a write timeout (or moves peer writes off the `serve()` loop) **and**
`electrs/` is bumped past that release. `UPDATING.md` already makes re-validating `patches/`
part of every submodule bump, so a bump is where this should surface. Removing it touches:

- `patches/0001-bound-client-write-so-a-wedged-peer-cannot-stall-the-server.patch` — delete
- `patches/README.md` — drop the `0001` section, and the file itself if no patches remain
- `Dockerfile` — if `patches/` ends up empty, drop the `patch` build dependency, the
  `COPY ./patches`, the apply loop, and their comment
- `README.md` — the build paragraph under the image table, and the "What Is Changed from
  Upstream" section
- `AGENTS.md` — the "binary is upstream plus carried patches" bullet
- `UPDATING.md` — the "Carried patches" bump step, if `patches/` is gone

Note that this patch only bounds the stall, at a small multiple of 60s (see
`patches/README.md`). Upstream option (3) in #1326 — moving peer writes off the sync loop — is
the real fix; if that is what lands, say so in the release notes of the version that drops the
patch, because it changes the guarantee rather than just removing a local delta.
