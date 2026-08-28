import { VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '0.11.1:21',
  releaseNotes: {
    en_US: `Electrs now runs against a pruned Bitcoin node.

The task asking you to turn pruning off is gone. Blocks your node no longer keeps are fetched from the Bitcoin network as the index needs them. Building the index for the first time on a node that has already pruned its history is slow — expect well over a day, and considerably longer if Bitcoin reaches peers only over Tor. An archival node indexes exactly as fast as before.`,
    es_ES: `Electrs ya funciona con un nodo Bitcoin podado.

La tarea que pedía desactivar la poda ha desaparecido. Los bloques que tu nodo ya no conserva se obtienen de la red Bitcoin a medida que el índice los necesita. Construir el índice por primera vez en un nodo que ya ha podado su historial es lento: cuenta con bastante más de un día, y considerablemente más si Bitcoin solo llega a sus pares por Tor. Un nodo de archivo indexa exactamente igual de rápido que antes.`,
    de_DE: `Electrs läuft jetzt auch mit einem beschnittenen Bitcoin-Knoten.

Die Aufgabe, die zum Abschalten des Beschneidens aufforderte, entfällt. Blöcke, die Ihr Knoten nicht mehr vorhält, werden aus dem Bitcoin-Netzwerk geholt, sobald der Index sie braucht. Den Index zum ersten Mal auf einem Knoten aufzubauen, der seinen Verlauf bereits beschnitten hat, dauert lange — rechnen Sie mit deutlich über einem Tag, und mit erheblich mehr, wenn Bitcoin seine Gegenstellen nur über Tor erreicht. Ein Archivknoten indiziert genauso schnell wie zuvor.`,
    pl_PL: `Electrs działa teraz z przyciętym węzłem Bitcoin.

Zadanie proszące o wyłączenie przycinania zniknęło. Bloki, których Twój węzeł już nie przechowuje, są pobierane z sieci Bitcoin w miarę jak indeks ich potrzebuje. Pierwsze zbudowanie indeksu na węźle, który już przyciął swoją historię, jest powolne — licz się ze znacznie więcej niż dobą, a przy Bitcoinie łączącym się z siecią wyłącznie przez Tor z czasem dużo dłuższym. Węzeł archiwalny indeksuje dokładnie tak szybko jak wcześniej.`,
    fr_FR: `Electrs fonctionne désormais avec un nœud Bitcoin élagué.

La tâche qui demandait de désactiver l'élagage a disparu. Les blocs que votre nœud ne conserve plus sont récupérés sur le réseau Bitcoin au fur et à mesure que l'index en a besoin. Construire l'index pour la première fois sur un nœud qui a déjà élagué son historique est lent : comptez bien plus d'une journée, et considérablement plus si Bitcoin ne joint ses pairs que par Tor. Un nœud d'archive s'indexe exactement aussi vite qu'avant.`,
  },
  migrations: {
    up: async ({ effects }) => {
      // the pruning task electrs no longer raises
      await sdk.action.clearTask(effects, 'bitcoind:autoconfig')
    },
  },
})
