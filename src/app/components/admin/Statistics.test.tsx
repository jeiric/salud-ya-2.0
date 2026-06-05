import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Statistics from './Statistics';

describe('Statistics', () => {
  it('renderiza las tarjetas resumen y los títulos de los gráficos', () => {
    render(<Statistics />);

    expect(screen.getByText('Total Citas Mes')).toBeInTheDocument();
    expect(screen.getByText('145')).toBeInTheDocument();
    expect(screen.getByText('+8.3% vs mes anterior')).toBeInTheDocument();

    expect(screen.getByText('Tasa de Asistencia')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('134 de 145 citas')).toBeInTheDocument();

    expect(screen.getByText('Pacientes Activos')).toBeInTheDocument();
    expect(screen.getByText('287')).toBeInTheDocument();
    expect(screen.getByText('+23 nuevos este mes')).toBeInTheDocument();

    expect(screen.getByText('Citas por Día (Semana Actual)')).toBeInTheDocument();
    expect(screen.getByText('Distribución por Especialidad')).toBeInTheDocument();
    expect(screen.getByText('Tendencia Mensual')).toBeInTheDocument();
    expect(screen.getByText('Indicadores de Rendimiento')).toBeInTheDocument();
  });

  it('muestra los valores de indicadores clave en el resumen final', () => {
    render(<Statistics />);

    expect(screen.getByText('Tiempo Promedio de Espera')).toBeInTheDocument();
    expect(screen.getByText('12 min')).toBeInTheDocument();
    expect(screen.getByText('Duración Media Consulta')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    expect(screen.getByText('Tasa de Cancelación')).toBeInTheDocument();
    expect(screen.getByText('8%')).toBeInTheDocument();
    expect(screen.getByText('Satisfacción Paciente')).toBeInTheDocument();
    expect(screen.getByText('4.7/5')).toBeInTheDocument();
  });
});
