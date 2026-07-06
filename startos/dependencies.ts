import { autoconfig } from 'bitcoin-core-startos/startos/actions/config/autoconfig'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
    input: {
      kind: 'partial',
      // A default (unpruned) bitcoind omits `prune`; per start-core
      // is_partial_of a null accept entry matches that missing key, so accept
      // both forms. null isn't in the number-typed DeepPartial, hence the cast.
      accept: [{ prune: 0 }, { prune: null as unknown as number }],
      set: { prune: 0 },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: i18n('Electrs requires an archival bitcoin node.'),
  })

  return {
    bitcoind: {
      healthChecks: ['bitcoind', 'sync-progress'],
      kind: 'running',
      versionRange: '>=28.4:13',
    },
  }
})
