import { BriefcaseBusiness } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { SourceBar } from '../components/SourceBar';

export function CommutePage() {
  const { routeId = 'demo-commute' } = useParams();

  return (
    <section className="view">
      <div className="view-header">
        <div>
          <p className="eyebrow">Pendelansicht</p>
          <h1>{routeId}</h1>
        </div>
        <SourceBar />
      </div>
      <div className="workflow-panel">
        <BriefcaseBusiness aria-hidden="true" size={28} />
        <h2>Morgenlage</h2>
        <p>Die Standardverbindung ist nutzbar. Ein Teilabschnitt meldet leichte Verzögerungen.</p>
        <div className="commute-grid">
          <span>Naechste Fahrt</span>
          <strong>08:12</strong>
          <span>Status</span>
          <strong>+3 min</strong>
          <span>Empfehlung</span>
          <strong>Warten</strong>
        </div>
      </div>
    </section>
  );
}
