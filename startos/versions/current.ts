import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:17',
  releaseNotes: {
    en_US: `Fixes the Sync Progress health check reporting a fully-synced server as still building its index.

Electrs answers RPC only between indexing batches, so a momentary silence is normal — but the health check read any silence as an unbuilt index and displayed "Electrs is building its address index. This can take several hours on first run." on servers whose index was complete, sometimes for hours at a stretch. The check now retries before drawing a conclusion, and once the index has been built it never claims a rebuild again — reporting instead that Electrs is busy. If you saw the old message on a working server, nothing was wrong and there was never any need to reindex.`,
    es_ES: `Corrige que la comprobación de estado Progreso de sincronización informara de un servidor totalmente sincronizado como si aún estuviera construyendo su índice.

Electrs solo responde a las llamadas RPC entre lotes de indexación, por lo que un silencio momentáneo es normal; sin embargo, la comprobación interpretaba cualquier silencio como un índice sin construir y mostraba "Electrs está construyendo su índice de direcciones. Esto puede tardar varias horas en la primera ejecución." en servidores cuyo índice ya estaba completo, a veces durante horas seguidas. Ahora la comprobación reintenta antes de concluir y, una vez construido el índice, nunca vuelve a anunciar una reconstrucción: indica que Electrs está ocupado. Si vio el mensaje antiguo en un servidor que funcionaba, no ocurría nada malo y nunca hizo falta reindexar.`,
    de_DE: `Behebt, dass die Zustandsprüfung „Synchronisierungsfortschritt“ einen vollständig synchronisierten Server als noch indizierend meldete.

Electrs beantwortet RPC-Aufrufe nur zwischen den Indizierungsdurchläufen, kurzes Schweigen ist also normal — die Prüfung wertete jedes Schweigen jedoch als fehlenden Index und zeigte „Electrs baut seinen Adressindex auf. Beim ersten Start kann dies mehrere Stunden dauern." auch auf Servern mit fertigem Index an, mitunter stundenlang. Die Prüfung fragt jetzt erneut nach, bevor sie ein Urteil fällt, und kündigt nach dem ersten fertigen Index nie wieder einen Neuaufbau an, sondern meldet, dass Electrs beschäftigt ist. Wer die alte Meldung auf einem laufenden Server gesehen hat: Es war nichts defekt, und eine Neuindizierung war nie nötig.`,
    pl_PL: `Naprawia kontrolę stanu „Postęp synchronizacji", która zgłaszała w pełni zsynchronizowany serwer jako wciąż budujący indeks.

Electrs odpowiada na wywołania RPC tylko pomiędzy partiami indeksowania, więc chwilowa cisza jest normalna — kontrola traktowała jednak każdą ciszę jako brak indeksu i wyświetlała „Electrs buduje swój indeks adresów. Przy pierwszym uruchomieniu może to potrwać kilka godzin." na serwerach z gotowym indeksem, czasem godzinami. Teraz kontrola ponawia próbę, zanim wyciągnie wniosek, a po zbudowaniu indeksu nigdy więcej nie ogłasza przebudowy — informuje, że Electrs jest zajęty. Jeśli widziałeś stary komunikat na działającym serwerze, nic nie było zepsute i ponowne indeksowanie nigdy nie było potrzebne.`,
    fr_FR: `Corrige le contrôle d'état « Progression de la synchronisation » qui signalait un serveur entièrement synchronisé comme construisant encore son index.

Electrs ne répond aux appels RPC qu'entre deux lots d'indexation : un silence momentané est donc normal. Le contrôle interprétait pourtant tout silence comme un index non construit et affichait « Electrs est en train de construire son index d'adresses. Cela peut prendre plusieurs heures lors de la première exécution. » sur des serveurs dont l'index était complet, parfois pendant des heures. Le contrôle réessaie désormais avant de conclure et, une fois l'index construit, n'annonce plus jamais de reconstruction : il indique qu'Electrs est occupé. Si vous avez vu l'ancien message sur un serveur fonctionnel, rien n'était cassé et il n'a jamais été nécessaire de réindexer.`,
  },
  migrations: {},
})
