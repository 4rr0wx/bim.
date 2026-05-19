import { Activity, AlertTriangle, Database, Map, Route, TrainFront } from 'lucide-react';
import { NavLink, Navigate, Route as RouterRoute, Routes } from 'react-router-dom';
import { CommutePage } from './pages/CommutePage';
import { DeparturesPage } from './pages/DeparturesPage';
import { DisruptionsPage } from './pages/DisruptionsPage';
import { MapPage } from './pages/MapPage';
import { RawPage } from './pages/RawPage';
import { RoutePage } from './pages/RoutePage';

const navItems = [
  { to: '/departures/demo-stop', label: 'Abfahrten', icon: TrainFront },
  { to: '/disruptions', label: 'Störungen', icon: AlertTriangle },
  { to: '/map', label: 'Karte', icon: Map },
  { to: '/route', label: 'Route', icon: Route },
  { to: '/commute/demo-commute', label: 'Pendeln', icon: Activity },
  { to: '/raw/demo-trip', label: 'Raw', icon: Database },
];

export function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/departures/demo-stop">
          bim.
        </NavLink>
        <nav aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink className="nav-link" key={item.to} to={item.to}>
                <Icon aria-hidden="true" size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </header>

      <main>
        <Routes>
          <RouterRoute path="/" element={<Navigate to="/departures/demo-stop" replace />} />
          <RouterRoute path="/departures/:stationId" element={<DeparturesPage />} />
          <RouterRoute path="/map" element={<MapPage />} />
          <RouterRoute path="/route" element={<RoutePage />} />
          <RouterRoute path="/disruptions" element={<DisruptionsPage />} />
          <RouterRoute path="/commute/:routeId" element={<CommutePage />} />
          <RouterRoute path="/raw/:tripId" element={<RawPage />} />
        </Routes>
      </main>

      <footer>
        <strong>Datenquellen</strong>
        <span>Datenquelle: ÖBB Mock</span>
        <span>Produktionsbetrieb erst nach erfüllten Datenlizenz-Checks.</span>
      </footer>
    </div>
  );
}
