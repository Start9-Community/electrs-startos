import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:14',
  releaseNotes: {
    en_US: `Fixes a crash loop when a wallet app queries Electrs heavily.

Electrs downloads whole blocks from Bitcoin Core to answer address history queries. It was doing that over the same connection anonymous peers from the internet use, so Bitcoin Core could drop it mid-query — and Electrs shuts down when its Bitcoin connection dies. With a busy client attached, such as Canary, it could be restarted every minute. Electrs now uses a dedicated local connection that Bitcoin Core trusts. This requires Bitcoin Core or Bitcoin Knots to be updated first; StartOS will prompt you.`,
    es_ES: `Corrige un ciclo de fallos cuando una aplicación de cartera consulta intensamente a Electrs.

Electrs descarga bloques enteros de Bitcoin Core para responder a las consultas de historial de direcciones. Lo hacía por la misma conexión que usan los pares anónimos de internet, así que Bitcoin Core podía cortarla a mitad de consulta — y Electrs se apaga cuando su conexión con Bitcoin muere. Con un cliente intensivo conectado, como Canary, podía reiniciarse cada minuto. Ahora Electrs usa una conexión local dedicada en la que Bitcoin Core confía. Para ello hay que actualizar antes Bitcoin Core o Bitcoin Knots; StartOS te lo pedirá.`,
    de_DE: `Behebt eine Neustartschleife, wenn eine Wallet-App Electrs stark abfragt.

Electrs lädt ganze Blöcke von Bitcoin Core, um Adressverlaufs-Abfragen zu beantworten. Das lief über dieselbe Verbindung, die anonyme Gegenstellen aus dem Internet nutzen, sodass Bitcoin Core sie mitten in einer Abfrage trennen konnte — und Electrs beendet sich, wenn seine Bitcoin-Verbindung abbricht. Mit einem aktiven Client wie Canary konnte es jede Minute neu starten. Electrs nutzt jetzt eine eigene lokale Verbindung, der Bitcoin Core vertraut. Dafür muss zuerst Bitcoin Core bzw. Bitcoin Knots aktualisiert werden; StartOS fordert dich dazu auf.`,
    pl_PL: `Naprawia pętlę awarii, gdy aplikacja portfela intensywnie odpytuje Electrs.

Electrs pobiera całe bloki z Bitcoin Core, aby odpowiadać na zapytania o historię adresów. Robił to przez to samo połączenie, którego używają anonimowe węzły z internetu, więc Bitcoin Core mógł je zerwać w trakcie zapytania — a Electrs wyłącza się, gdy jego połączenie z Bitcoinem padnie. Przy aktywnym kliencie, takim jak Canary, mógł restartować się co minutę. Electrs korzysta teraz z dedykowanego połączenia lokalnego, któremu Bitcoin Core ufa. Wymaga to wcześniejszej aktualizacji Bitcoin Core lub Bitcoin Knots; StartOS o tym przypomni.`,
    fr_FR: `Corrige une boucle de plantage lorsqu'une application de portefeuille sollicite fortement Electrs.

Electrs télécharge des blocs entiers depuis Bitcoin Core pour répondre aux requêtes d'historique d'adresse. Il le faisait via la même connexion que les pairs anonymes d'internet, si bien que Bitcoin Core pouvait la couper en pleine requête — et Electrs s'arrête quand sa connexion à Bitcoin tombe. Avec un client actif comme Canary, il pouvait redémarrer toutes les minutes. Electrs utilise désormais une connexion locale dédiée à laquelle Bitcoin Core fait confiance. Cela requiert de mettre d'abord à jour Bitcoin Core ou Bitcoin Knots ; StartOS vous y invitera.`,
  },
  migrations: {},
})
