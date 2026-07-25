import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.11.1:12',
  releaseNotes: {
    en_US: `Resolves the addresses of connected services more reliably.

Electrs looked up where to reach its dependencies through a field that only applies to one of the two ways a service can publish a port. It now reads the address itself, so a dependency changing how it serves TLS can no longer leave Electrs unable to find it. Nothing changes in normal operation.`,
    es_ES: `Resuelve de forma más fiable las direcciones de los servicios conectados.

Electrs localizaba sus dependencias mediante un campo que solo se aplica a una de las dos formas en que un servicio puede publicar un puerto. Ahora lee la dirección en sí, de modo que si una dependencia cambia su forma de servir TLS, Electrs seguirá encontrándola. En funcionamiento normal no cambia nada.`,
    de_DE: `Ermittelt die Adressen verbundener Dienste zuverlässiger.

Electrs suchte seine Abhängigkeiten über ein Feld, das nur für eine der beiden Arten gilt, auf die ein Dienst einen Port veröffentlichen kann. Jetzt wird die Adresse selbst gelesen, sodass eine Abhängigkeit, die ihre TLS-Bereitstellung ändert, für Electrs auffindbar bleibt. Im normalen Betrieb ändert sich nichts.`,
    pl_PL: `Pewniej ustala adresy połączonych usług.

Electrs wyszukiwał swoje zależności przez pole, które dotyczy tylko jednego z dwóch sposobów publikowania portu przez usługę. Teraz odczytuje sam adres, więc zależność zmieniająca sposób udostępniania TLS nadal pozostanie odnajdywalna dla Electrs. W normalnej pracy nic się nie zmienia.`,
    fr_FR: `Détermine plus fiablement les adresses des services connectés.

Electrs localisait ses dépendances via un champ qui ne s'applique qu'à l'un des deux modes de publication d'un port par un service. Il lit désormais l'adresse elle-même : une dépendance qui change sa façon de servir TLS reste donc trouvable par Electrs. Rien ne change en fonctionnement normal.`,
  },
  migrations: {},
})
