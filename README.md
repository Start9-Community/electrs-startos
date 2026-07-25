<p align="center">
  <img src="icon.svg" alt="Electrs Logo" width="21%">
</p>

# Electrs on StartOS

> **Upstream docs:** <https://github.com/romanz/electrs/blob/master/README.md>
>
> Everything not listed in this document should behave the same as upstream
> Electrs. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Electrs](https://github.com/romanz/electrs) is an efficient Electrum Server implementation in Rust, optimized for personal use. It indexes the Bitcoin blockchain and serves Electrum protocol queries to wallets.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                    |
| ------------- | ---------------------------------------- |
| Image         | Custom `dockerBuild` (built from source) |
| Architectures | x86_64, aarch64                          |
| Entrypoint    | `electrs`                                |

---

## Volume and Data Layout

| Volume                | Mount Point     | Purpose                                          |
| --------------------- | --------------- | ------------------------------------------------ |
| `main`                | `/data`         | Configuration and index database                 |
| (bitcoind dependency) | `/mnt/bitcoind` | Read-only access to Bitcoin data for cookie auth |
| (assets)              | `/assets`       | Scripts for health checks                        |

**StartOS-specific files:**

- `electrs.toml` — configuration file managed by StartOS
- `db/` — RocksDB index database (excluded from backups)

---

## Installation and First-Run Flow

| Step               | Upstream                                        | StartOS                        |
| ------------------ | ----------------------------------------------- | ------------------------------ |
| Bitcoin connection | Manual configuration (RPC address, cookie path) | Auto-configured via dependency |
| Configuration      | CLI arguments or config file                    | Configure action in StartOS UI |
| Initial sync       | ~6.5 hours for full blockchain                  | Same (depends on hardware)     |

**Key difference:** On StartOS, the Bitcoin connection is fully automatic — Electrs reaches bitcoind's RPC and P2P ports over the internal LXC bridge (the addresses are resolved from the `bitcoind` dependency at runtime and written into `electrs.toml`), using cookie authentication from the mounted dependency volume.

**First run:** Electrs waits for Bitcoin to finish its initial block download before it starts building its own address index. Expect two stages on the StartOS status card:

1. `waiting` — "Waiting for Bitcoin to finish syncing" while Bitcoin completes IBD
2. `loading` — "Electrs is building its address index…" while Electrs builds its RocksDB index

Total time is hardware-dependent and can take many hours. The Electrum port is not served until both stages are complete.

---

## Configuration Management

| Setting              | Upstream Method | StartOS Method                         |
| -------------------- | --------------- | -------------------------------------- |
| `cookie_file`        | Config/CLI      | Fixed: `/mnt/bitcoind/.cookie`         |
| `daemon_rpc_addr`    | Config/CLI      | Auto: bitcoind RPC over the LXC bridge |
| `daemon_p2p_addr`    | Config/CLI      | Auto: bitcoind P2P over the LXC bridge |
| `network`            | Config/CLI      | Fixed: `bitcoin`                       |
| `electrum_rpc_addr`  | Config/CLI      | Fixed: `0.0.0.0:50001`                 |
| `log_filters`        | Config/CLI      | Configure action: "Log Level"          |
| `index_batch_size`   | Config/CLI      | Configure action: "Index Batch Size"   |
| `index_lookup_limit` | Config/CLI      | Configure action: "Index Lookup Limit" |

**Configuration options NOT exposed on StartOS:**

- `db_dir` — fixed to `/data/db`
- `skip_block_download_wait` — not exposed
- `jsonrpc_timeout` — not exposed
- `server_banner` — not exposed
- `signet_magic` — not applicable (mainnet only)

---

## Network Access and Interfaces

| Interface | Internal Port | External Port | Protocol                    | Purpose            |
| --------- | ------------- | ------------- | --------------------------- | ------------------ |
| Main      | 50001         | 50002         | TCP+SSL (Electrum protocol) | Wallet connections |

The interface is SSL-only: electrs itself listens unencrypted on 50001 inside the container, and StartOS terminates TLS at the platform edge on 50002 (`addSsl` on the bind, `secure: null`). No plain-TCP port is exposed externally — this is deliberate (Electrum traffic carries address queries; all major wallets support `ssl://`), and it matches the Fulcrum package.

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

### Configure

| Property     | Value                    |
| ------------ | ------------------------ |
| ID           | `config`                 |
| Name         | Configure                |
| Visibility   | Enabled (always visible) |
| Availability | Any status               |
| Purpose      | Adjust Electrs settings  |

**Options:**

| Setting            | Default | Description                                               |
| ------------------ | ------- | --------------------------------------------------------- |
| Log Level          | INFO    | Verbosity: ERROR, WARN, INFO, DEBUG, TRACE                |
| Index Batch Size   | 10      | Max blocks to request from Bitcoin per batch (1-10000)    |
| Index Lookup Limit | 0       | Max transactions to lookup before timeout (0 = unlimited) |

---

## Dependencies

### Bitcoin (required)

| Property           | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| Version constraint | `>= 28.3`                                              |
| Required state     | Running                                                |
| Health checks      | `bitcoind`, `sync-progress`                            |
| Mounted volume     | `main` → `/mnt/bitcoind` (read-only)                   |
| Purpose            | Blockchain data via RPC and P2P, cookie authentication |

The `sync-progress` health check surfaces Bitcoin's initial block download state directly in the Electrs dependency panel — while Bitcoin is still syncing, Electrs reports its bitcoind dependency as unsatisfied rather than running its own duplicate RPC poll.

The service automatically:

- Connects to Bitcoin RPC over the internal LXC bridge (resolved from the `bitcoind` dependency)
- Connects to Bitcoin P2P over the internal LXC bridge (resolved from the `bitcoind` dependency)
- Uses cookie authentication from the mounted dependency volume
- Restarts if the Bitcoin cookie file changes

**Auto-configuration:** On install, a critical task auto-configures Bitcoin to disable pruning (`prune: 0`), since Electrs requires an archival node.

**Bitcoin requirements:**

- `server=1` must be enabled (default on StartOS)
- `txindex=1` is NOT required (unlike some other Electrum servers)
- Pruning must be disabled (archival node required)

---

## Backups and Restore

**Included in backup:**

- `main` volume configuration files (`electrs.toml`)

**Excluded from backup:**

- `db/` directory — the RocksDB index database

**Restore behavior:**

- Configuration is restored
- Index database must be rebuilt from scratch (will re-sync on first start)
- Re-indexing takes several hours

---

## Health Checks

| Check           | Display         | Method                                           |
| --------------- | --------------- | ------------------------------------------------ |
| Electrum Server | Electrum Server | Port 50001 listening, with cookie-aware fallback |
| Sync Progress   | Sync Progress   | Electrs's own Electrum RPC readiness signal      |

**Electrum Server details:**

The daemon is considered `success` when port 50001 is listening. When it is not yet listening, Electrs is still in its bitcoind-polling loop (electrs won't bind the port until Bitcoin is past IBD and its P2P interface is reachable). Rather than reporting `failure`, the check inspects the mounted `/mnt/bitcoind/.cookie` file and reports:

- `waiting` — "Waiting for Bitcoin to finish syncing" (cookie present → Bitcoin RPC is up)
- `waiting` — "Waiting for Bitcoin to start" (no cookie → Bitcoin not yet running)

**Sync Progress details:**

Sync progress is `loading` until Electrs has built its address index and is ready to serve Electrum queries. The check connects to Electrs's own Electrum RPC on `localhost:50001` (via `bash /dev/tcp`) and calls an index-requiring method. Electrs returns `{"code": -32603, "message": "unavailable index"}` until its internal `is_ready` flag flips, which happens only after both initial indexing AND the one-time post-indexing RocksDB compaction complete. No Bitcoin RPC or Prometheus scraping is performed. Messages:

- `loading` — "Electrs is building its address index. This can take several hours on first run."
- `success` — "Fully synced"

When sync first reaches `success` after install, a **Sync Complete** notification is posted to the StartOS notifications panel (fires once per install).

Bitcoin's own sync state is surfaced via the `sync-progress` dependency health check (see [Dependencies](#dependencies)), not this check.

---

## Limitations and Differences

1. **Mainnet only** — network is fixed to `bitcoin`; testnet/signet not supported
2. **Fixed Bitcoin connection** — must use the StartOS Bitcoin dependency; cannot connect to external Bitcoin nodes
3. **Custom-built image** — built from source rather than using pre-built binaries
4. **Index excluded from backups** — restoring from backup requires full re-indexing
5. **Limited configuration** — some advanced options (server banner, timeouts) not exposed

---

## What Is Unchanged from Upstream

- Full Electrum protocol v1.4 support
- RocksDB index storage
- Fast synchronization performance
- Low CPU/memory usage after initial sync
- Efficient mempool tracking
- All standard Electrum wallet compatibility
- Query functionality (balance, history, transactions)

---

## Contributing

Build and development workflow follow the StartOS packaging guide: <https://docs.start9.com/packaging>. Keep `README.md`, `instructions.md`, and `AGENTS.md` in sync with any change to user-visible behavior or package structure.

---

## Quick Reference for AI Consumers

```yaml
package_id: electrs
image: dockerBuild (custom)
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  electrum_internal: 50001 (not exposed externally)
  electrum_ssl: 50002 (StartOS-terminated TLS; the only external port)
dependencies:
  - bitcoind (required)
fixed_config:
  cookie_file: /mnt/bitcoind/.cookie
  network: bitcoin
  electrum_rpc_addr: 0.0.0.0:50001
runtime_config:
  daemon_rpc_addr: <bitcoind RPC over the LXC bridge>
  daemon_p2p_addr: <bitcoind P2P over the LXC bridge>
startos_managed_config:
  - log_filters
  - index_batch_size
  - index_lookup_limit
actions:
  - config (enabled, any)
health_checks:
  - electrs_daemon: port 50001 listening, with cookie-aware waiting state
  - sync: probes electrs Electrum RPC on localhost:50001 for `unavailable index`
dependency_health_checks:
  - bitcoind: [bitcoind, sync-progress]
backup_volumes:
  - main (excludes /db)
```
