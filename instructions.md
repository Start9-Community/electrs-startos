# Electrs

Electrs needs a fully-synced Bitcoin archival node to do anything useful. Install **Bitcoin** first and let it finish its initial block download before expecting Electrs to come online — until then, Electrs will sit in a waiting state.

## Documentation

- [Electrs upstream README](https://github.com/romanz/electrs/blob/master/README.md) — the upstream project's documentation, including configuration reference and protocol notes.

## What you get on StartOS

- An **Electrum protocol server** that indexes the Bitcoin blockchain and answers wallet queries.
- An **Electrum (SSL)** interface exposing the Electrum protocol, reachable over LAN, `.local`, Tor, and any custom domains you've configured. Every address StartOS shows for it is an `ssl://` one — StartOS terminates TLS with the device's certificate — so your wallet needs SSL turned on.
- Automatic wiring to your StartOS Bitcoin node — RPC, P2P, and cookie authentication are all configured for you. You do not point Electrs at Bitcoin yourself.
- A RocksDB address index stored under the `main` volume (excluded from backups; it rebuilds itself if you restore).

## Getting set up

1. Install **Bitcoin** first if it isn't already installed.
2. Start Electrs. On first run it will report **Electrum server is starting** until it has bound its port, and it will not begin indexing until your Bitcoin node has completed its initial block download. This can take a long time on a fresh node.
3. Once Bitcoin is fully synced, Electrs will switch to **Electrs is building its address index** while it builds its own index. This typically takes several hours on first run.
4. When the **Sync Progress** health check reports **Fully synced**, point your wallet at the **Electrum (SSL)** interface — copy the address from the **Interfaces** page rather than typing a port from memory.

Once that first **Fully synced** appears, the index is built and is never rebuilt. If **Sync Progress** later reports **Electrs is not responding. It is likely busy indexing; this usually clears on its own.**, that is a busy moment — Electrs answers wallet queries only between indexing batches — and it clears by itself, normally within a minute or two. It does not mean the index is being rebuilt, and it is not a reason to reindex.

## Using Electrs

### Electrum (SSL) interface

Copy an address from the **Interfaces** page into your wallet's server settings. It is shown as an `ssl://` URL, and the host and port in it are what your wallet needs — **take the port from that address rather than assuming one**, since StartOS assigns it and it is not always the same number on every server.

Make sure your wallet's SSL option is on: in Sparrow that is _Private Electrum → Use SSL_, and in Electrum it is the `s` suffix on the server entry. Connecting with SSL off fails with a generic error such as "Retries exhausted" rather than anything naming TLS.

The certificate is issued by your device's root CA. A wallet that lets you accept or pin an unrecognised certificate — Sparrow does — connects with nothing further to do; accept it when asked. Electrs then serves all standard Electrum protocol queries: balances, history, transaction lookups, mempool tracking.

### Setting up the Electrum desktop wallet

Electrum is the exception. It checks a server against its own bundled list of public certificate authorities, and your device's certificate authority is not on that list, so it refuses the connection. It has no setting for trusting your device either, so you place the certificate in its data directory yourself. This is once per address, not once per session.

1. Download `http://<your-server>/static/local-root-ca.crt` — the same root CA StartOS offers you for your browser.
2. Delete any file already sitting at `<data-dir>/certs/<host>`. One left over from an earlier attempt stops the rest of this working, without reporting anything.
3. Save the certificate as `<data-dir>/certs/<host>`, with no file extension. `<host>` has to match exactly what you type into Electrum, so reaching the same server at `192.168.1.5` and at `my-server.local` needs one file for each.
4. Enter the server as `<host>:<port>:s`, taking the port from the address on the **Interfaces** page.

`<data-dir>` is `~/.electrum` on Linux, `~/Library/Application Support/Electrum` on macOS, and `%APPDATA%\Electrum` on Windows.

This trusts the authority rather than one certificate, so it keeps working when your server renews.

### Actions

- **Configure** — adjust the log verbosity and two indexer tuning knobs (batch size and per-address lookup limit). Defaults are sensible; only touch these if you have a specific reason.
