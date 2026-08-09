import { VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_0_11_1_18 = VersionInfo.of({
  version: '0.11.1:18',
  releaseNotes: {
    en_US: `Fixes a hang where Electrs stopped serving wallets and stopped following the chain.

A single wallet that went away without closing its connection — a laptop that slept, a dropped VPN or Tor circuit — could freeze the whole server. Electrs writes every reply from the same loop that indexes blocks, and that write waited on the vanished wallet for as long as the network stack kept trying: no wallet was served and no block was indexed until it gave up, which took anywhere from twenty minutes to eight hours. It always recovered on its own, but a frozen server looks like a stuck resync, and restarting it was the only way to cut the wait short. Electrs now gives up on a wallet that has accepted nothing for a full minute and disconnects just that one, leaving everything else running. Nothing you saw from this required reindexing, and it never damaged an index.`,
    es_ES: `Corrige un bloqueo por el que Electrs dejaba de atender a las carteras y de seguir la cadena.

Una sola cartera que desaparecía sin cerrar su conexión —un portátil que se suspendía, una VPN o un circuito Tor caídos— podía congelar todo el servidor. Electrs escribe cada respuesta desde el mismo bucle que indexa los bloques, y esa escritura esperaba a la cartera desaparecida durante todo el tiempo que la pila de red siguiera intentándolo: no se atendía a ninguna cartera ni se indexaba ningún bloque hasta que se rendía, lo que tardaba entre veinte minutos y ocho horas. Siempre se recuperaba solo, pero un servidor congelado parece una resincronización atascada, y reiniciarlo era la única forma de acortar la espera. Ahora Electrs se rinde con una cartera que no ha aceptado nada durante un minuto entero y desconecta únicamente esa, dejando todo lo demás en marcha. Nada de lo que viste por este motivo exigía reindexar, y nunca dañó ningún índice.`,
    de_DE: `Behebt einen Stillstand, bei dem Electrs keine Wallets mehr bediente und der Kette nicht mehr folgte.

Eine einzige Wallet, die verschwand, ohne ihre Verbindung zu schließen — ein Laptop im Ruhezustand, ein abgebrochenes VPN oder ein abgebrochener Tor-Kanal — konnte den gesamten Server einfrieren. Electrs schreibt jede Antwort aus derselben Schleife, die auch Blöcke indiziert, und dieser Schreibvorgang wartete auf die verschwundene Wallet, solange der Netzwerk-Stack es weiter versuchte: Es wurde keine Wallet bedient und kein Block indiziert, bis er aufgab — das dauerte zwischen zwanzig Minuten und acht Stunden. Der Server erholte sich immer von selbst, aber ein eingefrorener Server sieht aus wie eine hängende Neusynchronisierung, und ein Neustart war die einzige Möglichkeit, die Wartezeit abzukürzen. Electrs gibt eine Wallet, die eine volle Minute lang nichts angenommen hat, jetzt auf und trennt nur diese eine, während alles andere weiterläuft. Nichts davon hat je eine Neuindizierung erfordert oder einen Index beschädigt.`,
    pl_PL: `Naprawia zawieszenie, przy którym Electrs przestawał obsługiwać portfele i śledzić łańcuch.

Pojedynczy portfel, który zniknął bez zamknięcia połączenia — uśpiony laptop, zerwany VPN lub obwód Tor — potrafił zamrozić cały serwer. Electrs zapisuje każdą odpowiedź z tej samej pętli, która indeksuje bloki, a ten zapis czekał na zniknięty portfel tak długo, jak długo stos sieciowy ponawiał próby: żaden portfel nie był obsługiwany i żaden blok nie był indeksowany, dopóki się nie poddał, co trwało od dwudziestu minut do ośmiu godzin. Serwer zawsze wracał do siebie sam, ale zamrożony serwer wygląda jak zacięta ponowna synchronizacja, a restart był jedynym sposobem na skrócenie oczekiwania. Electrs rezygnuje teraz z portfela, który przez pełną minutę niczego nie przyjął, i rozłącza wyłącznie ten jeden, pozostawiając resztę działającą. Nic z tego nigdy nie wymagało ponownego indeksowania ani nie uszkodziło indeksu.`,
    fr_FR: `Corrige un blocage qui empêchait Electrs de servir les portefeuilles et de suivre la chaîne.

Un seul portefeuille disparu sans fermer sa connexion — un ordinateur portable mis en veille, un VPN ou un circuit Tor coupé — pouvait figer le serveur entier. Electrs écrit chaque réponse depuis la boucle qui indexe aussi les blocs, et cette écriture attendait le portefeuille disparu aussi longtemps que la pile réseau réessayait : aucun portefeuille n'était servi et aucun bloc n'était indexé jusqu'à ce qu'elle abandonne, ce qui prenait de vingt minutes à huit heures. Le serveur repartait toujours de lui-même, mais un serveur figé ressemble à une resynchronisation bloquée, et le redémarrer était le seul moyen d'écourter l'attente. Electrs abandonne désormais un portefeuille qui n'a rien accepté pendant une minute entière et ne déconnecte que celui-là, en laissant tout le reste fonctionner. Rien de tout cela n'a jamais exigé de réindexer ni endommagé un index.`,
  },
  migrations: {
    up: async ({ effects }) => {
      // replay keys abandoned when bitcoind renamed its config action
      // ('config' → 'other-config' → 'autoconfig'); no-op where absent
      await sdk.action.clearTask(
        effects,
        'bitcoind:config',
        'bitcoind:other-config',
      )
    },
  },
})
