# bim.

> **Bim zeigt, was wirklich passiert.**

## Produktmission

`bim.` ist ein schlankes Transit-Produkt für Pendler:innen, das geplante und tatsächliche Verkehrslage zusammenführt und dadurch **schnell verständliche, handlungsrelevante Informationen** liefert:

- **Was fährt wann wirklich?**
- **Wo gibt es Störungen?**
- **Welche Alternativen habe ich jetzt?**

Ziel ist eine Nutzererfahrung, die in wenigen Sekunden von der Frage zur Entscheidung führt (z. B. „Warte ich noch oder nehme ich eine alternative Route?“).

---

## Scope-Abgrenzung: V1 vs. V2

### V1 (Lieferziel)

V1 fokussiert auf ein zuverlässiges, performantes **Read-first Produkt** mit klaren Kernansichten:

- Live-nahe Abfahrten pro Haltestelle
- Karten-/Routenansichten zur Orientierung
- Störungsübersicht
- Pendelansicht für wiederkehrende Fahrten
- Rohdatenansicht für Debugging/Transparenz

**Nicht-Ziel in V1:** komplexe Personalisierung, tiefgreifende Prognosemodelle, Multi-Provider-Aggregation als Primärfokus.

### V2 (Ausbau)

V2 erweitert auf Produktintelligenz und Komfort:

- Persistente Profile/Favoriten/Benachrichtigungen
- Bessere Re-Routing-/Alternativvorschläge
- Historische Auswertungen (Pünktlichkeit, Muster)
- Erweiterte Datenintegration über einzelne Feeds hinaus

---

## V1-Featureliste und Routen

### 1) Abfahrten je Station
- **Route:** `/departures/:stationId`
- **Zweck:** zeigt aktuelle/nahe Abfahrten mit Ist-Zeit, Soll-Zeit, Verspätungsindikatoren und Status.

### 2) Netz-/Kartenansicht
- **Route:** `/map`
- **Zweck:** visualisiert Linien/Positionen/Stationen zur schnellen räumlichen Einordnung.

### 3) Routenansicht
- **Route:** `/route`
- **Zweck:** stellt Verbindung(en) zwischen Start/Ziel dar und verbindet Plan- mit Echtzeitinformationen.

### 4) Störungsansicht
- **Route:** `/disruptions`
- **Zweck:** listet aktive Störungen, Ausfälle und relevante Hinweise mit Priorisierung.

### 5) Pendelansicht
- **Route:** `/commute/:routeId`
- **Zweck:** optimierte Ansicht für häufig genutzte Wege inkl. schnell erfassbarer Lage je Fahrt.

### 6) Rohdaten-/Debugansicht
- **Route:** `/raw/:tripId`
- **Zweck:** macht zugrunde liegende Datensignale transparent (Debugging, Nachvollziehbarkeit, Qualitätssicherung).

---

## Datenquellen, Zweck und Lizenzhinweise

## Primäre Datenquellen

1. **GTFS Static (Fahrplandaten)**
   - **Zweck:** Linien, Haltestellen, Trips, Stop-Times als Planungsgrundlage.
   - **Einsatz im Produkt:** Basismodell für Routen-/Abfahrtsdarstellung.

2. **GTFS Realtime (GTFS-RT, Protobuf)**
   - **Zweck:** Echtzeit-Updates (Verspätungen, Fahrzeugpositionen, Service-Änderungen).
   - **Einsatz im Produkt:** Live-Status, Störungen, tatsächliche Abfahrten.

## Lizenz/Attribution

- Konkrete Nutzungsrechte richten sich nach den jeweiligen Datenbereitstellungsbedingungen der Quelle.
- Im UI muss eine **sichtbare Quellenangabe** geführt werden:
  - **„Datenquelle: ÖBB“**
- Zusätzlich sollten (je nach Feed-Bedingung) Lizenzlink und Aktualisierungszeitpunkt abrufbar sein.

---

## Technischer Stack

## Frontend

- Moderne Web-App (SPA) mit komponentenbasierter UI.
- Fokus auf schnelle initiale Ladezeit für Kernseiten (`/departures`, `/disruptions`).

## State-Management

- Serverseitige Daten (GTFS/GTFS-RT) getrennt von lokalem UI-State.
- Caching-/Revalidierungsstrategie für häufige Echtzeit-Updates.

## Routing

- Clientseitiges Routing mit klarer Trennung der Kernrouten:
  `/departures/:stationId`, `/map`, `/route`, `/disruptions`, `/commute/:routeId`, `/raw/:tripId`.

## Optionales Backend (empfohlen)

- Thin backend/proxy layer für:
  - Feed-Aggregation/Normalisierung
  - CORS-Entkopplung
  - Rate-Limit-Schutz und Caching
  - Schutz sensibler Konfigurationen/Keys (falls nötig)

---

## Risiken & Gotchas

1. **GTFS-ZIP-Größe**
   - Static-Feeds können groß sein (Download, Parse, Memory-Footprint).
   - Konsequenz: Streaming/inkrementelle Verarbeitung und aggressive Caches einplanen.

2. **GTFS-RT als Protobuf**
   - Dekodierung erfordert passende Protobuf-Schemas/Bibliotheken.
   - Konsequenz: robustes Fehlerhandling bei Schema-/Feed-Drift und ungültigen Messages.

3. **CORS und Proxy-Notwendigkeit**
   - Direkte Browser-Requests gegen Feed-Endpunkte sind oft durch CORS eingeschränkt.
   - Konsequenz: Backend-Proxy als Standardpfad für stabile Produktion.

---

## Empfohlene Build-Reihenfolge (Roadmap)

1. **Datenpipeline-Basics aufsetzen**
   - GTFS Static laden/parsen, internes Domänenmodell definieren.

2. **Echtzeitintegration hinzufügen**
   - GTFS-RT konsumieren, Matching mit Static-Trip/Stop-Struktur sicherstellen.

3. **Backend-Proxy & Caching implementieren**
   - CORS lösen, Feed-Zugriff stabilisieren, Last reduzieren.

4. **Kernroute `/departures/:stationId` liefern**
   - Erstes nutzbares End-to-End Feature mit Livebezug.

5. **`/disruptions` ergänzen**
   - Betriebslage sichtbar machen, Priorisierung von Events definieren.

6. **`/map` und `/route` ausbauen**
   - räumliche und verbindungsbezogene Orientierung vervollständigen.

7. **`/commute/:routeId` hinzufügen**
   - wiederkehrende Wege als schnelle Alltagsansicht optimieren.

8. **`/raw/:tripId` für Transparenz/Debug bereitstellen**
   - Datenqualität und Fehlersuche im Betrieb erleichtern.

9. **Hardening & Observability**
   - Monitoring, Logging, Fallbacks, Performance-Budgets, QA-Szenarien.

---

## Hinweise für neue Mitwirkende

- Architekturentscheidungen zuerst in den Abschnitten **Scope-Abgrenzung**, **Datenquellen** und **Risiken & Gotchas** lesen.
- Vor Featurearbeit klären, ob ein Thema zu **V1** oder **V2** gehört.
- Jede neue Oberfläche mit klarer Datenquellen- und Attribution-Strategie planen.
