# TODO

- Report the wedged-client stall upstream at romanz/electrs (check for an existing issue
  first): `Peer::send`'s blocking `write_all` runs inline on the single `serve()` loop and
  no socket in the tree sets a timeout, so one client that stops draining its receive
  window freezes serving and indexing until the kernel gives up — observed 19m–8h39m in
  the field. Every electrs deployment has this, not just StartOS. Evidence, the carried
  fix, and its retirement condition: `patches/README.md` (0001) and PR #82.
