# Compliance-Checkliste für Datenlizenzen

Zweck: Sicherstellen, dass `bim` nur mit rechtskonformer Datenverwendung betrieben und veröffentlicht wird.

## 1) Pflicht-Attributionen in der UI

### Checkliste

- [ ] **ÖBB-Attributionstext ist hinterlegt und aktuell.**
  - Sichtbarkeit in der UI:
    - [ ] Im dauerhaft erreichbaren Bereich „Datenquellen“/„Impressum“/„Über“.
    - [ ] In unmittelbarer Nähe zu ÖBB-basierten Abfahrts- oder Störungsdaten (mindestens per klar erkennbarem Link „Datenquelle“).
- [ ] **MVO-Attributionstext ist hinterlegt und aktuell.**
  - Sichtbarkeit in der UI:
    - [ ] Im dauerhaft erreichbaren Bereich „Datenquellen“/„Impressum“/„Über“.
    - [ ] In unmittelbarer Nähe zu MVO-basierten Inhalten (oder über klaren, direkt zuordenbaren Quellhinweis).
- [ ] **Wiener-Linien-Attributionstext ist hinterlegt und aktuell.**
  - Sichtbarkeit in der UI:
    - [ ] Im dauerhaft erreichbaren Bereich „Datenquellen“/„Impressum“/„Über“.
    - [ ] In unmittelbarer Nähe zu Wiener-Linien-basierten Inhalten (oder über klaren, direkt zuordenbaren Quellhinweis).
- [ ] **Attribution für inoffizielle ÖBB-Referenz ist klar als „inoffiziell / nicht von ÖBB betrieben“ gekennzeichnet.**
  - Sichtbarkeit in der UI:
    - [ ] Direkt beim Feature/Datensatz, der diese Quelle nutzt.
    - [ ] Zusätzlich im Bereich „Datenquellen“/„Über“ mit Hinweis auf mögliche Abweichungen.

> Hinweis: Konkrete Wortlaute je Quelle müssen aus den jeweils gültigen Lizenzbedingungen bzw. Verträgen übernommen werden.

---

## 2) Freigabestatus je Datenquelle

Statuswerte:
- **Freigegeben** = Nutzung in Produktion zulässig.
- **Bedingt** = nur für Entwicklung/Staging oder mit klar definierten Auflagen.
- **Gesperrt** = keine Nutzung in produktiven Ausspielungen.

### Datenquellen-Matrix

- [ ] **ÖBB**
  - Status: `Gesperrt / Bedingt / Freigegeben` (zutreffendes auswählen)
  - Nachweise:
    - [ ] Lizenzbedingungen dokumentiert
    - [ ] Nutzungsscope (z. B. Caching, Weitergabe, SLA) geprüft
    - [ ] Attribution geprüft
- [ ] **MVO**
  - Status: `Gesperrt / Bedingt / Freigegeben` (zutreffendes auswählen)
  - Nachweise:
    - [ ] **Unterschriebene MVO-Lizenzvereinbarung liegt vor**
    - [ ] Erlaubte Nutzung dokumentiert
    - [ ] Attribution geprüft
- [ ] **Wiener Linien**
  - Status: `Gesperrt / Bedingt / Freigegeben` (zutreffendes auswählen)
  - Nachweise:
    - [ ] Aktuelle Lizenz-/Nutzungsbedingungen geprüft
    - [ ] Technische Nutzungsauflagen geprüft
    - [ ] Attribution geprüft
- [ ] **Inoffizielle ÖBB-Referenz**
  - Status: `Gesperrt / Bedingt / Freigegeben` (zutreffendes auswählen)
  - Nachweise:
    - [ ] Rechtliche Risikobewertung dokumentiert
    - [ ] Kennzeichnung als inoffiziell in der UI umgesetzt
    - [ ] Fallback-Strategie bei Wegfall/Änderung definiert

---

## 3) Bedingungen für Produktivbetrieb

Produktivbetrieb ist nur zulässig, wenn **alle** folgenden Punkte erfüllt sind:

- [ ] Für jede produktiv genutzte Datenquelle ist der Status **Freigegeben**.
- [ ] Verpflichtende Attributionen sind korrekt in der UI sichtbar.
- [ ] Lizenzauflagen (z. B. Rate Limits, Speicherdauer, Weitergabeverbote) sind technisch umgesetzt.
- [ ] **MVO-Lizenzvereinbarung ist unterschrieben und archiviert.**
- [ ] Interne Verantwortliche (Produkt + Technik + Recht/Compliance) haben die Freigabe dokumentiert.

---

## 4) Release-Gate (verpflichtender Prüfpunkt)

### Release-Prozess-Check

- [ ] Ticket/Checkliste „Datenlizenz-Checks“ für den Release ist vorhanden.
- [ ] Alle offenen Punkte aus dieser Datei sind für den Scope des Releases abgeschlossen.
- [ ] **Gate-Regel bestätigt:** „Keine Produktion ohne erfüllte Datenlizenz-Checks“.
- [ ] Freigabe im Release-Protokoll dokumentiert (inkl. Datum, Verantwortliche, Nachweisdokumente).

Empfehlung zur Umsetzung im Workflow:
- Pull-Request-Template um Checkbox „Datenlizenz-Checks erfüllt“ ergänzen.
- CI- oder Release-Check einführen, der Deployments auf Produktion blockiert, solange der Rechts-/Lizenz-Status nicht auf „freigegeben“ steht.
