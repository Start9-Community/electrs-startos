import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:16',
  releaseNotes: {
    en_US: `Fixes Electrs failing to start after an update from StartOS 0.3.5.1.

On StartOS 0.3.5.1 Electrs authenticated to Bitcoin with an RPC username and password, kept in its own config file. StartOS 0.4.0 authenticates with Bitcoin's cookie file instead, but the old username and password survived the update, and Electrs refuses to start when it is handed both: "ambiguous configuration - auth and cookie_file can't be specified at the same time". The leftover credentials are now removed, and Electrs starts normally.`,
    es_ES: `Corrige el fallo de arranque de Electrs tras actualizar desde StartOS 0.3.5.1.

En StartOS 0.3.5.1, Electrs se autenticaba ante Bitcoin con un usuario y una contraseña RPC, guardados en su propio archivo de configuración. StartOS 0.4.0 se autentica mediante el archivo cookie de Bitcoin, pero el usuario y la contraseña antiguos sobrevivían a la actualización, y Electrs se niega a arrancar cuando recibe ambos: "ambiguous configuration - auth and cookie_file can't be specified at the same time". Las credenciales sobrantes ahora se eliminan y Electrs arranca con normalidad.`,
    de_DE: `Behebt, dass Electrs nach einem Update von StartOS 0.3.5.1 nicht mehr startet.

Unter StartOS 0.3.5.1 authentifizierte sich Electrs bei Bitcoin mit RPC-Benutzername und -Passwort, die in seiner eigenen Konfigurationsdatei standen. StartOS 0.4.0 authentifiziert sich stattdessen über Bitcoins Cookie-Datei, doch die alten Zugangsdaten überlebten das Update — und Electrs verweigert den Start, wenn ihm beides vorliegt: "ambiguous configuration - auth and cookie_file can't be specified at the same time". Die übrig gebliebenen Zugangsdaten werden jetzt entfernt, und Electrs startet wieder normal.`,
    pl_PL: `Naprawia sytuację, w której Electrs nie uruchamia się po aktualizacji z StartOS 0.3.5.1.

W StartOS 0.3.5.1 Electrs uwierzytelniał się w Bitcoinie nazwą użytkownika i hasłem RPC, zapisanymi we własnym pliku konfiguracyjnym. StartOS 0.4.0 uwierzytelnia się zamiast tego plikiem cookie Bitcoina, ale stara nazwa użytkownika i hasło przetrwały aktualizację, a Electrs odmawia uruchomienia, gdy otrzyma jedno i drugie: "ambiguous configuration - auth and cookie_file can't be specified at the same time". Pozostałe dane uwierzytelniające są teraz usuwane i Electrs uruchamia się normalnie.`,
    fr_FR: `Corrige l'impossibilité de démarrer Electrs après une mise à jour depuis StartOS 0.3.5.1.

Sous StartOS 0.3.5.1, Electrs s'authentifiait auprès de Bitcoin avec un nom d'utilisateur et un mot de passe RPC, inscrits dans son propre fichier de configuration. StartOS 0.4.0 s'authentifie désormais avec le fichier cookie de Bitcoin, mais l'ancien identifiant et son mot de passe survivaient à la mise à jour, et Electrs refuse de démarrer lorsqu'on lui fournit les deux : "ambiguous configuration - auth and cookie_file can't be specified at the same time". Les identifiants résiduels sont maintenant supprimés et Electrs démarre normalement.`,
  },
  migrations: {},
})
