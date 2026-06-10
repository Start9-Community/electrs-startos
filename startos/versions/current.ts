import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { LogFilters } from '../utils'

export const current = VersionInfo.of({
  version: '0.11.1:8',
  releaseNotes: {
    en_US: `- Corrects the instructions: the Electrum interface is SSL-only (port 50002, certificate from your device's StartOS root CA). The previously documented plain-TCP port (50001) was never exposed externally and is not intended to be — all major wallets support ssl:// servers.`,
    es_ES: `- Corrige las instrucciones: la interfaz Electrum es solo SSL (puerto 50002, certificado de la CA raíz de StartOS de su dispositivo). El puerto TCP sin cifrar documentado anteriormente (50001) nunca estuvo expuesto externamente y no está previsto que lo esté: todas las carteras principales admiten servidores ssl://.`,
    de_DE: `- Korrigiert die Anleitung: Die Electrum-Schnittstelle ist nur über SSL erreichbar (Port 50002, Zertifikat von der StartOS-Root-CA Ihres Geräts). Der zuvor dokumentierte unverschlüsselte TCP-Port (50001) war nie extern verfügbar und soll es auch nicht sein — alle gängigen Wallets unterstützen ssl://-Server.`,
    pl_PL: `- Poprawia instrukcję: interfejs Electrum działa wyłącznie przez SSL (port 50002, certyfikat z głównego CA StartOS urządzenia). Wcześniej udokumentowany nieszyfrowany port TCP (50001) nigdy nie był wystawiony na zewnątrz i nie jest to planowane — wszystkie popularne portfele obsługują serwery ssl://.`,
    fr_FR: `- Corrige les instructions : l'interface Electrum est uniquement SSL (port 50002, certificat de l'autorité racine StartOS de votre appareil). Le port TCP en clair documenté précédemment (50001) n'a jamais été exposé à l'extérieur et n'est pas destiné à l'être — tous les portefeuilles majeurs prennent en charge les serveurs ssl://.`,
  },
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      const configYaml:
        | {
            'log-filters': LogFilters
            'index-batch-size': number
            'index-lookup-limit': number
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        await tomlFile.write(effects, {
          cookie_file: '/mnt/bitcoind/.cookie',
          daemon_rpc_addr: 'bitcoind.startos:8332',
          daemon_p2p_addr: 'bitcoind.startos:8333',
          electrum_rpc_addr: '0.0.0.0:50001',
          network: 'bitcoin',
          log_filters: configYaml['log-filters'],
          index_batch_size: configYaml['index-batch-size'],
          index_lookup_limit: configYaml['index-lookup-limit'],
        })

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
