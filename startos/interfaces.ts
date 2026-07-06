import { i18n } from './i18n'
import { sdk } from './sdk'
import { electrumHostId, port } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multihost = sdk.MultiHost.of(effects, electrumHostId)
  // SSL-only by design: with secure: null the OS exposes just the TLS port
  // (50002) on regular LAN gateways. Electrum traffic carries address queries,
  // all major wallets support ssl://, and this matches the Fulcrum package.
  const mainMultiOrigin = await multihost.bindPort(port, {
    protocol: null,
    addSsl: {
      preferredExternalPort: 50002,
      alpn: null,
      addXForwardedHeaders: false,
      auth: null,
    },
    preferredExternalPort: port,
    secure: null,
  })
  const main = sdk.createInterface(effects, {
    name: i18n('Main'),
    id: 'main',
    description: i18n('The main interface for accessing electrs'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const mainReceipt = await mainMultiOrigin.export([main])

  return [mainReceipt]
})
