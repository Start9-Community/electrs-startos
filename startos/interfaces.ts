import { i18n } from './i18n'
import { sdk } from './sdk'
import { electrumHostId, port } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multihost = sdk.MultiHost.of(effects, electrumHostId)
  // secure: null still allocates a plaintext external port. It is reachable
  // over lxcbr0 — the address dependents resolve — and from nowhere else, so
  // off the box the TLS one is all there is.
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
    name: i18n('Electrum (SSL)'),
    id: 'main',
    description: i18n('The Electrum protocol endpoint, served over SSL'),
    type: 'api',
    masked: false,
    // protocol: null leaves the origin scheme-less, which renders every address
    // as a bare host:port with nothing marking it as TLS.
    schemeOverride: { ssl: 'ssl', noSsl: 'tcp' },
    username: null,
    path: '',
    query: {},
  })

  const mainReceipt = await mainMultiOrigin.export([main])

  return [mainReceipt]
})
