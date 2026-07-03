import { autoconfig } from 'bitcoin-core-startos/startos/actions/config/autoconfig'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
    input: {
      kind: 'partial',
      accept: [{ prune: 0 }],
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
