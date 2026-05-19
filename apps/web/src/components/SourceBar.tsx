import type { FeedMeta } from '@bim/shared';
import { formatRelativeAge } from '@bim/shared';
import { AlertTriangle, Database } from 'lucide-react';

type SourceBarProps = {
  meta?: FeedMeta;
};

export function SourceBar({ meta }: SourceBarProps) {
  if (!meta) {
    return (
      <aside className="source-bar">
        <Database aria-hidden="true" size={18} />
        <span>Datenquelle: ÖBB Mock</span>
      </aside>
    );
  }

  return (
    <aside className={meta.is_stale ? 'source-bar source-bar--stale' : 'source-bar'}>
      {meta.is_stale ? <AlertTriangle aria-hidden="true" size={18} /> : <Database aria-hidden="true" size={18} />}
      <span>Datenquelle: ÖBB Mock</span>
      <span>{meta.source === 'realtime' ? 'Echtzeit bevorzugt' : 'Statischer Fahrplan'}</span>
      <span>Aktualisiert {formatRelativeAge(meta.data_timestamp)}</span>
      {meta.is_stale && <strong>Eingeschränkte Aktualität</strong>}
    </aside>
  );
}
