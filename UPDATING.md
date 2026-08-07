# Updating the upstream version

Electrs is built from source via the `electrs/` git submodule (see `.gitmodules`) — there is no `dockerTag` in the manifest, no cargo-install version pin in the `Dockerfile`. The submodule commit is the version pin.

## Determining the upstream version

- **electrs** (`romanz/electrs`, https://github.com/romanz/electrs)
  ```bash
  gh release view -R romanz/electrs --json tagName -q .tagName
  ```
  Compare against the commit currently checked out in the `electrs/` submodule:
  ```bash
  git -C electrs describe --tags --exact-match HEAD
  ```

## Applying the bump

- **electrs** — advance the submodule to the new tag and stage the gitlink:
  ```bash
  git -C electrs fetch --tags
  git -C electrs checkout v<new version>
  git add electrs
  ```
- **Carried patches** — re-validate everything in `patches/` against the new tag:
  - Check each patch's **Retire when** condition in [patches/README.md](patches/README.md). A patch upstream has absorbed is deleted, along with its README section — not re-applied.
  - The Dockerfile applies what remains with `patch -p1 --fuzz=0`, so a patch whose context the bump changed fails the build. That failure is the gate working: re-derive the patch against the new tag (or retire it) — never loosen `--fuzz`.
