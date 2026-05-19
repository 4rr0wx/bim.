import { Route } from 'lucide-react';
import { SourceBar } from '../components/SourceBar';

export function RoutePage() {
  return (
    <section className="view">
      <div className="view-header">
        <div>
          <p className="eyebrow">Verbindung</p>
          <h1>Route planen</h1>
        </div>
        <SourceBar />
      </div>
      <div className="workflow-panel">
        <Route aria-hidden="true" size={28} />
        <h2>Wien Meidling → Wien Hauptbahnhof</h2>
        <p>Mock-Vorschau fuer eine Verbindung mit Planzeit, Live-Status und Störungsbezug.</p>
        <ol>
          <li>RJ 533 ab Wien Meidling</li>
          <li>Aktuelle Verspätung: +3 min</li>
          <li>Alternative: S80 Richtung Wien Aspern Nord</li>
        </ol>
      </div>
    </section>
  );
}
