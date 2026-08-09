import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:19',
  releaseNotes: {
    en_US: `The wallet address now says \`ssl://\`, so it is clear your wallet needs SSL switched on.

The Electrum endpoint has always been SSL — StartOS terminates TLS in front of Electrs — but the Interfaces page showed a bare \`host:port\` with nothing to indicate that. A wallet configured from it failed with a generic error: Sparrow reports only "Retries exhausted", which names neither SSL nor the certificate. Addresses are now shown as \`ssl://\` URLs and the interface is named **Electrum (SSL)**. Copy the port from that address rather than assuming one — StartOS assigns it, and it is not the same number on every server. Nothing about how Electrs is reached has changed.`,
    es_ES: `La dirección para la cartera ahora indica \`ssl://\`, así queda claro que tu cartera necesita SSL activado.

El punto de acceso Electrum siempre ha sido SSL —StartOS termina el TLS por delante de Electrs— pero la página de Interfaces mostraba un simple \`host:puerto\` sin nada que lo indicara. Una cartera configurada a partir de ahí fallaba con un error genérico: Sparrow solo informa "Retries exhausted", que no menciona ni SSL ni el certificado. Ahora las direcciones se muestran como URLs \`ssl://\` y la interfaz se llama **Electrum (SSL)**. Copia el puerto de esa dirección en lugar de suponer uno: lo asigna StartOS y no es el mismo número en todos los servidores. No ha cambiado nada en la forma de acceder a Electrs.`,
    de_DE: `Die Wallet-Adresse zeigt jetzt \`ssl://\`, damit klar ist, dass in der Wallet SSL aktiviert sein muss.

Der Electrum-Endpunkt war immer SSL — StartOS terminiert das TLS vor Electrs —, aber die Schnittstellen-Seite zeigte nur ein nacktes \`Host:Port\` ohne jeden Hinweis darauf. Eine daraus konfigurierte Wallet scheiterte mit einem generischen Fehler: Sparrow meldet lediglich "Retries exhausted", was weder SSL noch das Zertifikat erwähnt. Adressen werden nun als \`ssl://\`-URLs angezeigt und die Schnittstelle heißt **Electrum (SSL)**. Übernimm den Port aus dieser Adresse, statt einen anzunehmen — StartOS vergibt ihn, und er ist nicht auf jedem Server dieselbe Nummer. An der Erreichbarkeit von Electrs ändert sich nichts.`,
    pl_PL: `Adres dla portfela pokazuje teraz \`ssl://\`, więc widać, że w portfelu trzeba włączyć SSL.

Punkt końcowy Electrum zawsze działał po SSL — StartOS kończy TLS przed Electrs — ale strona Interfejsy pokazywała goły \`host:port\` bez żadnej o tym wzmianki. Portfel skonfigurowany na tej podstawie kończył się ogólnym błędem: Sparrow zgłasza jedynie "Retries exhausted", co nie wspomina ani o SSL, ani o certyfikacie. Adresy są teraz pokazywane jako adresy \`ssl://\`, a interfejs nazywa się **Electrum (SSL)**. Skopiuj port z tego adresu, zamiast go zakładać — przydziela go StartOS i nie jest to ten sam numer na każdym serwerze. Sposób łączenia się z Electrs nie uległ zmianie.`,
    fr_FR: `L'adresse destinée au portefeuille indique désormais \`ssl://\`, ce qui montre que votre portefeuille doit avoir SSL activé.

Le point d'accès Electrum a toujours été en SSL — StartOS termine le TLS devant Electrs — mais la page Interfaces affichait un simple \`hôte:port\` sans rien pour le signaler. Un portefeuille configuré à partir de là échouait avec une erreur générique : Sparrow ne signale que "Retries exhausted", qui ne mentionne ni SSL ni le certificat. Les adresses sont maintenant affichées sous forme d'URL \`ssl://\` et l'interface s'appelle **Electrum (SSL)**. Reprenez le port de cette adresse plutôt que d'en supposer un : c'est StartOS qui l'attribue, et ce n'est pas le même numéro sur tous les serveurs. Rien ne change dans la façon d'atteindre Electrs.`,
  },
  migrations: {},
})
