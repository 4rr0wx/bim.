import { describe, expect, it } from 'vitest';
import { delayLabel, formatRelativeAge, isStale, secondsBetween } from '../index';

describe('shared time helpers', () => {
  it('calculates elapsed seconds', () => {
    expect(secondsBetween('2026-05-19T10:00:00.000Z', '2026-05-19T10:00:22.000Z')).toBe(22);
  });

  it('formats relative age in German', () => {
    expect(formatRelativeAge('2026-05-19T10:00:00.000Z', '2026-05-19T10:00:22.000Z')).toBe(
      'vor 22s',
    );
  });

  it('detects stale data beyond threshold', () => {
    expect(isStale('2026-05-19T10:00:00.000Z', '2026-05-19T10:01:00.000Z', 45)).toBe(true);
  });

  it('formats delay labels', () => {
    expect(delayLabel(180)).toBe('+3 min');
    expect(delayLabel(0)).toBe('pünktlich');
  });
});
