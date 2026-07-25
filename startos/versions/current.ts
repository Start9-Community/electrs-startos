import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:15',
  releaseNotes: {
    en_US: `Stops Electrs reloading at the moment Bitcoin Core goes away.

Electrs reloads when Bitcoin Core issues new RPC credentials, which it does on every restart. That reload was previously triggered as soon as Bitcoin Core *began* shutting down — while its RPC was already unreachable — so Electrs was restarted against a backend that was not there yet, and Electrs exits when it cannot reach Bitcoin. It now reloads only once Bitcoin Core is back up and has published new credentials.`,
    es_ES: `Evita que Electrs se recargue justo cuando Bitcoin Core desaparece.

Electrs se recarga cuando Bitcoin Core emite nuevas credenciales RPC, algo que hace en cada reinicio. Esa recarga se activaba en cuanto Bitcoin Core *empezaba* a apagarse — cuando su RPC ya era inalcanzable —, así que Electrs arrancaba contra un backend que todavía no estaba, y Electrs se cierra cuando no puede alcanzar a Bitcoin. Ahora se recarga solo cuando Bitcoin Core ha vuelto y ha publicado nuevas credenciales.`,
    de_DE: `Verhindert, dass Electrs genau dann neu lädt, wenn Bitcoin Core verschwindet.

Electrs lädt neu, sobald Bitcoin Core neue RPC-Zugangsdaten ausgibt — was bei jedem Neustart geschieht. Dieses Neuladen wurde bisher ausgelöst, sobald Bitcoin Core mit dem Herunterfahren *begann* — während dessen RPC bereits nicht mehr erreichbar war. Electrs startete also gegen ein Backend, das noch nicht da war, und Electrs beendet sich, wenn es Bitcoin nicht erreichen kann. Es lädt jetzt erst neu, wenn Bitcoin Core wieder läuft und neue Zugangsdaten veröffentlicht hat.`,
    pl_PL: `Zapobiega przeładowaniu Electrs dokładnie w chwili, gdy znika Bitcoin Core.

Electrs przeładowuje się, gdy Bitcoin Core wydaje nowe dane uwierzytelniające RPC, co robi przy każdym restarcie. Dotąd to przeładowanie uruchamiało się, gdy tylko Bitcoin Core *zaczynał* się wyłączać — a jego RPC było już nieosiągalne — więc Electrs startował wobec backendu, którego jeszcze nie było, a Electrs kończy pracę, gdy nie może połączyć się z Bitcoinem. Teraz przeładowuje się dopiero wtedy, gdy Bitcoin Core wróci i opublikuje nowe dane uwierzytelniające.`,
    fr_FR: `Empêche Electrs de se recharger au moment précis où Bitcoin Core disparaît.

Electrs se recharge lorsque Bitcoin Core émet de nouveaux identifiants RPC, ce qu'il fait à chaque redémarrage. Ce rechargement était jusqu'ici déclenché dès que Bitcoin Core *commençait* à s'arrêter — alors que son RPC était déjà injoignable —, si bien qu'Electrs redémarrait face à un backend encore absent, et Electrs s'arrête lorsqu'il ne peut pas joindre Bitcoin. Il ne se recharge désormais qu'une fois Bitcoin Core revenu et de nouveaux identifiants publiés.`,
  },
  migrations: {},
})
