import React from 'react';
import { createBrowserRouter } from "react-router-dom"; // 👈 ¡Agrega esta línea!
import Home from './pages/Home';

import Login from './pages/Login';
import PatientRegistration from './pages/PatientRegistration';
import AppointmentCalendar from './pages/AppointmentCalendar';
import Confirmation from './pages/Confirmation';
import Dashboard from './pages/admin/Dashboard';

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/registro',
    element: <PatientRegistration />,
  },
  {
    path: '/calendario',
    element: <AppointmentCalendar />,
  },
  {
    path: '/confirmacion',
    element: <Confirmation />,
  },
  {
    path: '/admin/dashboard',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">404</h1>
          <p className="text-gray-600">Página no encontrada</p>
        </div>
      </div>
    ),
  },
];

export const router = createBrowserRouter(routes);
