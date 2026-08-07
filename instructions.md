# Electrs

Electrs needs a fully-synced Bitcoin archival node to do anything useful. Install **Bitcoin** first and let it finish its initial block download before expecting Electrs to come online — until then, Electrs will sit in a waiting state.

## Documentation

- [Electrs upstream README](https://github.com/romanz/electrs/blob/master/README.md) — the upstream project's documentation, including configuration reference and protocol notes.

## What you get on StartOS

- An **Electrum protocol server** that indexes the Bitcoin blockchain and answers wallet queries.
- A **Main** interface exposing the Electrum protocol over SSL (port 50002), reachable over LAN, `.local`, Tor, and any custom domains you've configured. Connections are SSL-only — StartOS terminates TLS with the device's certificate, and all major wallets (Electrum, Sparrow, BlueWallet, etc.) support `ssl://` servers.
- Automatic wiring to your StartOS Bitcoin node — RPC, P2P, and cookie authentication are all configured for you. You do not point Electrs at Bitcoin yourself.
- A RocksDB address index stored under the `main` volume (excluded from backups; it rebuilds itself if you restore).

## Getting set up

1. Install **Bitcoin** first if it isn't already installed.
2. Start Electrs. On first run it will report **Electrum server is starting** until it has bound its port, and it will not begin indexing until your Bitcoin node has completed its initial block download. This can take a long time on a fresh node.
3. Once Bitcoin is fully synced, Electrs will switch to **Electrs is building its address index** while it builds its own index. This typically takes several hours on first run.
4. When the **Sync Progress** health check reports **Fully synced**, point your Electrum wallet at the **Main** interface (SSL, port 50002).

Once that first **Fully synced** appears, the index is built and is never rebuilt. If **Sync Progress** later reports **Electrs is not responding. It is likely busy indexing; this usually clears on its own.**, that is a busy moment — Electrs answers wallet queries only between indexing batches — and it clears by itself, normally within a minute or two. It does not mean the index is being rebuilt, and it is not a reason to reindex.

## Using Electrs

### Main interface

The **Main** interface is the Electrum protocol endpoint. Copy its address from the **Dashboard** tab into your Electrum wallet's server settings as an `ssl://` server. If your wallet asks about the certificate (it is issued by your device's StartOS root CA), accept or pin it — Electrum pins it on first use, Sparrow shows a one-time trust prompt. Electrs serves all standard Electrum protocol queries: balances, history, transaction lookups, mempool tracking.

### Actions

- **Configure** — adjust the log verbosity and two indexer tuning knobs (batch size and per-address lookup limit). Defaults are sensible; only touch these if you have a specific reason.
