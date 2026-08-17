import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:20',
  releaseNotes: {
    en_US: `The instructions now link to a full wallet-connection guide.

Pointing a wallet at your own Electrum server takes the same few steps whatever wallet you use — turning SSL on, taking the port from the address rather than assuming one, and getting the wallet to trust the certificate your server issues. Those are now written up in one place in the Start9 Bitcoin guides, together with the settings path for each wallet and the certificate file the Electrum desktop wallet needs placed by hand. The Instructions tab links there instead of carrying a partial copy. Nothing about Electrs itself has changed.`,
    es_ES: `Las instrucciones ahora enlazan con una guía completa para conectar carteras.

Apuntar una cartera a tu propio servidor Electrum requiere los mismos pasos sea cual sea la cartera: activar SSL, tomar el puerto de la dirección en lugar de suponer uno, y conseguir que la cartera confíe en el certificado que emite tu servidor. Todo eso está ahora recogido en un solo sitio, en las guías de Bitcoin de Start9, junto con la ruta de ajustes de cada cartera y el archivo de certificado que la cartera de escritorio Electrum necesita que coloques a mano. La pestaña Instrucciones enlaza allí en lugar de llevar una copia parcial. Nada de Electrs en sí ha cambiado.`,
    de_DE: `Die Anleitung verweist jetzt auf einen vollständigen Leitfaden zum Verbinden von Wallets.

Eine Wallet auf den eigenen Electrum-Server zu richten erfordert immer dieselben Schritte, egal welche Wallet: SSL einschalten, den Port aus der Adresse übernehmen statt einen anzunehmen, und die Wallet dazu bringen, dem Zertifikat Ihres Servers zu vertrauen. Das steht jetzt an einer Stelle in den Bitcoin-Leitfäden von Start9 — zusammen mit dem Einstellungspfad jeder Wallet und der Zertifikatsdatei, die die Electrum-Desktop-Wallet von Hand abgelegt braucht. Der Reiter Anleitung verlinkt dorthin, statt eine unvollständige Kopie zu führen. An Electrs selbst ändert sich nichts.`,
    pl_PL: `Instrukcje odsyłają teraz do pełnego przewodnika po podłączaniu portfeli.

Skierowanie portfela na własny serwer Electrum wymaga tych samych kilku kroków niezależnie od portfela: włączenia SSL, wzięcia portu z adresu zamiast zakładania go i sprawienia, by portfel zaufał certyfikatowi wystawianemu przez Twój serwer. Wszystko to jest teraz opisane w jednym miejscu, w przewodnikach Bitcoin od Start9, razem ze ścieżką ustawień dla każdego portfela i plikiem certyfikatu, który trzeba ręcznie umieścić dla portfela Electrum na komputer. Zakładka Instrukcje odsyła tam, zamiast powielać niepełną kopię. W samym Electrs nic się nie zmieniło.`,
    fr_FR: `Les instructions renvoient désormais vers un guide complet de connexion des portefeuilles.

Pointer un portefeuille vers votre propre serveur Electrum demande les mêmes quelques étapes quel que soit le portefeuille : activer SSL, reprendre le port depuis l'adresse plutôt que d'en supposer un, et amener le portefeuille à faire confiance au certificat émis par votre serveur. Tout cela est maintenant réuni en un seul endroit, dans les guides Bitcoin de Start9, avec le chemin des réglages de chaque portefeuille et le fichier de certificat que le portefeuille de bureau Electrum exige d'être placé à la main. L'onglet Instructions y renvoie au lieu d'en porter une copie partielle. Rien ne change dans Electrs lui-même.`,
  },
  migrations: {},
})
