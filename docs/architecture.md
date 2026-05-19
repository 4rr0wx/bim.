# Architekturüberblick: Datenfluss und Verantwortlichkeiten

Dieses Dokument beschreibt den geplanten Datenfluss für GTFS-Static- und GTFS-Realtime-Daten, die Systemgrenzen zwischen Frontend und einem optionalen Backend-Proxy sowie die Fallback-Strategien und nicht-funktionalen Anforderungen.

## 1) Datenfluss: GTFS Static (vorverarbeitet) und GTFS-RT (Polling alle 15–30s)

### GTFS Static (vorverarbeitet)
- GTFS-Static-Dateien (`stops.txt`, `trips.txt`, `stop_times.txt`, `routes.txt` etc.) werden vorab verarbeitet (Build- oder Ingest-Schritt).
- Aus den Rohdaten wird ein frontendfreundliches, normalisiertes Modell erzeugt (z. B. Haltestellenindex, Trip-Referenzen, Linienmetadaten).
- Das Ergebnis wird versioniert bereitgestellt (z. B. pro Fahrplanstand) und kann im Frontend gecacht werden.
- Diese Daten gelten als "Basisfahrplan" und dienen als stabile Referenz für alle Realtime-Anreicherungen.

### GTFS-Realtime (GTFS-RT)
- GTFS-RT-Feeds (Trip Updates, Vehicle Positions, Service Alerts) werden zyklisch alle **15–30 Sekunden** abgerufen.
- Polling kann direkt im Frontend oder über einen Backend-Proxy erfolgen.
- Jede Polling-Antwort wird in ein internes, einheitliches Modell normalisiert (z. B. konsistente IDs, Zeitstempel, Statusflags).
- Realtime-Daten werden mit statischen Referenzdaten verknüpft (Route, Stop, Trip), damit die UI konsistente Informationen darstellen kann.

## 2) Verantwortungsgrenzen: Frontend vs. optionaler Backend-Proxy

### Frontend-Verantwortung
- Darstellung, Interaktion und Zustand der UI.
- Abruf der bereits aufbereiteten API-Endpunkte (Departures, Vehicle Positions, Alerts).
- Zusammenführung von API-Ergebnissen für Widgets/Karten/Listen.
- Kennzeichnung von Datenfrische und Fallback-Status in der Oberfläche.

### Optionaler Backend-Proxy: Verantwortung
- Kapselung externer Feed-Endpunkte (CORS, API-Keys, Rate Limits).
- Polling-Orchestrierung und Zwischenspeicherung (z. B. kurzer Cache mit TTL).
- Normalisierung/Validierung heterogener Feed-Inhalte.
- Bereitstellung eines stabilen API-Contracts für das Frontend.
- Optionale Observability-Funktionen (Latenz, Fehlerraten, Feed-Health).

### Klare Grenze
- **Frontend** kennt keine Feed-spezifischen Rohformate, sondern nur den internen API-Contract.
- **Proxy** ist verantwortlich für Feed-Details, Fehlertoleranz beim Polling und semantisch konsistente Antwortobjekte.

## 3) Fallback-Strategie: Realtime bevorzugen, static schedule als Backup

1. Wenn Realtime verfügbar und frisch ist, wird Realtime bevorzugt dargestellt.
2. Wenn Realtime fehlt, fehlerhaft ist oder als "stale" markiert wird, fällt das System auf den statischen Fahrplan zurück.
3. UI zeigt transparent an:
   - Datenquelle (Realtime vs. Static Fallback)
   - Letzten erfolgreichen Realtime-Zeitstempel
   - Optional einen Hinweis auf eingeschränkte Aktualität.
4. Bei partiellen Ausfällen (z. B. nur Vehicle Positions fehlen) kann pro Datenbereich separat gefallbackt werden.

## 4) API-Contract-Idee für Frontend-Endpunkte

Die Endpunkte sind absichtlich frontendorientiert und entkoppeln Feed-Rohformate von der UI.

### `GET /api/departures?stop_id=...&limit=...`
- Liefert Abfahrten für eine Haltestelle.
- Felder (Beispiel):
  - `route_id`, `route_short_name`
  - `trip_id`, `stop_id`
  - `scheduled_departure_ts`
  - `realtime_departure_ts` (optional)
  - `delay_seconds` (optional)
  - `source` = `realtime | static`
  - `data_timestamp`

### `GET /api/vehicle-positions?bbox=...` oder `?route_id=...`
- Liefert Fahrzeugpositionen für Karte/Filter.
- Felder (Beispiel):
  - `vehicle_id`, `trip_id`, `route_id`
  - `lat`, `lon`, `bearing`, `speed`
  - `occupancy_status` (optional)
  - `data_timestamp`

### `GET /api/service-alerts?active=true`
- Liefert aktive Betriebsmeldungen.
- Felder (Beispiel):
  - `alert_id`, `title`, `description`
  - `severity`, `cause`, `effect`
  - `informed_entities` (route/stop/trip)
  - `start_ts`, `end_ts`
  - `data_timestamp`

### `GET /api/raw/{feedType}` (Raw View)
- Debug-/Transparenz-Endpunkt für rohe oder nahezu rohe Feed-Inhalte.
- Zweck: Diagnose, Vergleich von Normalisierungsergebnissen, Troubleshooting.
- Zugriff kann optional geschützt/gedrosselt werden.

## 5) Nicht-Funktionsanforderungen

### Aktualisierungsfrequenz
- Ziel: Realtime-Polling alle 15–30 Sekunden.
- UI sollte neue Daten ohne vollständigen Reload integrieren.

### Fehlertoleranz
- Timeouts, Retry mit Backoff und kurze Caches zur Glättung von Feed-Aussetzern.
- Letzte gültige Antwort kann kurzzeitig weiterverwendet werden (grace period), klar als potenziell veraltet markiert.

### Datenstempel & Transparenz
- Jede API-Antwort enthält mindestens:
  - `data_timestamp` (wann stammen die Nutzdaten)
  - `fetched_at` (wann wurden sie vom System geholt)
  - `is_stale` (bool)
  - `source` (`realtime` oder `static`)
- UI zeigt diese Metadaten nutzerverständlich an (z. B. "Aktualisiert vor 22s").

## 6) Kurzes Sequenzdiagramm (Textform)

```text
User/UI        -> Frontend        : Request (z. B. Departures)
Frontend       -> Backend-Proxy   : GET /api/departures?stop_id=...
Backend-Proxy  -> GTFS-RT Feed    : Poll / fetch TripUpdates (15–30s)
Backend-Proxy  -> GTFS Static Data: Lookup/Join mit vorverarbeiteten Referenzen
Backend-Proxy  -> Normalisierung  : Vereinheitlichen + Fallback-Entscheidung
Normalisierung -> Backend-Proxy   : Antwortobjekt mit source/timestamps/is_stale
Backend-Proxy  -> Frontend        : JSON Response (contract-stabil)
Frontend       -> UI              : Render + Frische-/Fallback-Hinweis
```

> Hinweis: Ohne Backend-Proxy erfolgt der Feed-Abruf direkt im Frontend; Normalisierung und Fallback-Logik bleiben konzeptionell identisch, sollten dann aber in einer klar gekapselten Datenzugriffsschicht liegen.
