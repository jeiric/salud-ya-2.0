import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppointmentProvider } from '../app/context/AppointmentContext';

function AllProviders({ children }: { children: React.ReactNode }) {
  return <AppointmentProvider>{children}</AppointmentProvider>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: AllProviders,
    ...options,
  });
}

export function renderWithRouter(
  routes: Parameters<typeof createMemoryRouter>[0],
  initialEntries: string[] = ['/'],
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const router = createMemoryRouter(routes, { initialEntries });

  return render(
    <AppointmentProvider>
      <RouterProvider router={router} />
    </AppointmentProvider>,
    options
  );
}
