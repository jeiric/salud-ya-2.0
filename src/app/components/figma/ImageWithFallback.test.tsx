import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageWithFallback } from './ImageWithFallback';

describe('ImageWithFallback', () => {
  it('muestra la imagen original y luego muestra el fallback cuando falla la carga', () => {
    render(<ImageWithFallback src="/imagen-invalida.png" alt="Imagen de prueba" />);

    const originalImage = screen.getByAltText('Imagen de prueba');
    expect(originalImage).toBeInTheDocument();
    expect(originalImage).toHaveAttribute('src', '/imagen-invalida.png');

    fireEvent.error(originalImage);

    const fallbackImage = screen.getByAltText('Error loading image');
    expect(fallbackImage).toBeInTheDocument();
    expect(fallbackImage).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml;base64')); 
    expect(fallbackImage).toHaveAttribute('data-original-url', '/imagen-invalida.png');
  });
});
