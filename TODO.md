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

## Watch spesmilo/electrum#7459 before trusting the documented Electrum workaround

`instructions.md` walks the user through dropping the device's root CA at
`<datadir>/certs/<host>` so the Electrum desktop wallet will connect. **That path is
undocumented and works by accident**, which is what makes it worth watching:
`_get_ssl_context` only reaches `is_server_ca_signed` when `_is_saved_ssl_cert_available()`
is False, and that check requires nothing more than a file that exists, parses as PEM/X509
and is in date — never that it is self-signed or matches the peer. The file then goes to
`create_default_context(cafile=...)` with `check_hostname = False`, so a root CA works as a
trust anchor and survives leaf rotation.

The underlying refusal is that a StartOS chain — `leaf ← StartOS Local Intermediate CA ←
<device> Local Root CA` — is OpenSSL verify code 19 (`self-signed certificate in certificate
chain`) against a public bundle, and `is_server_ca_signed` returns False only on code 18 and
re-raises everything else. Reproduced on Electrum 4.6.2 against both Fulcrum and electrs. Full analysis, and the
options offered upstream, are in
[spesmilo/electrum#7459](https://github.com/spesmilo/electrum/issues/7459).

**Watch for a regression, not just a fix.** Nothing upstream guarantees the drop keeps
working: tightening `_is_saved_ssl_cert_available()` to require a self-signed or
peer-matching certificate would break the documented steps silently, with the wallet simply
refusing to connect again.

Revisit the docs when any of these lands:

- **Electrum documents the `certs/<host>` drop** — soften the instructions' framing from
  "you place the certificate yourself" to a link at the upstream page.
- **A CA-import path ships** (config key or GUI file picker feeding `load_verify_locations`)
  — replace the manual steps with it.
- **Verify code 19 is treated like 18**, falling through to trust-on-first-use — the whole
  section goes away; Electrum then behaves like Sparrow and needs no setup at all.
- **The drop stops working** — the steps have to be replaced with whatever the new path is,
  urgently, because they will fail with no error naming TLS.

Touches when it changes:

- `instructions.md` — the `### Setting up the Electrum desktop wallet` section, and the
  sentence above it about wallets that accept or pin an unrecognised certificate
- `README.md` — the one-sentence pointer in the interfaces section

fulcrum-startos carries the identical section and the same TODO; change both together.
