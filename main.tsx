import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './src/app/routes';
import { AppointmentProvider } from './src/app/context/AppointmentContext'; // 👈 Importación corregida para la raíz
// @ts-ignore
import './src/styles/globals.css'; 

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* Envolvemos toda la app con el contenedor de datos */}
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    </React.StrictMode>
  );
}
