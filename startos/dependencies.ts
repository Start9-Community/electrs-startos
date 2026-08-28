import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    healthChecks: ['bitcoind', 'sync-progress'],
    kind: 'running',
    // Per-major, not one floor: a bare `>=28.4:26` would also admit 29.0 and
    // 30.0, which sort above it but predate the revision those lines need.
    versionRange:
      '(>=28.4:26 && <29) || (>=29.4:13 && <30) || (>=30.3:13 && <31) || >=31.1:13',
  },
}))
