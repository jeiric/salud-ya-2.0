import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (utils)', () => {
  it('combina clases simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resuelve conflictos de Tailwind (última gana)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('ignora valores falsy', () => {
    expect(cn('base', false && 'hidden', undefined, 'extra')).toBe('base extra');
  });
});
