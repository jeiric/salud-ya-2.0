import { describe, it, expect } from 'vitest';
import { routes } from './routes';

describe('routes', () => {
  it('define las rutas principales de la aplicación', () => {
    const paths = routes.map((route) => route.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        '/',
        '/login',
        '/registro',
        '/calendario',
        '/confirmacion',
        '/admin/dashboard',
        '*',
      ])
    );
  });
});
