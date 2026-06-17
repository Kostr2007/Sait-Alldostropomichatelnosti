import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

// Мокаем Leaflet — функции объявляются внутри фабрики для hoisting
vi.mock('leaflet', () => {
  const mockRemove = vi.fn();
  const mockSetView = vi.fn().mockReturnThis();
  const mockAddTo = vi.fn().mockReturnThis();
  const mockBindPopup = vi.fn().mockReturnThis();

  const mockMapInstance = {
    setView: mockSetView,
    remove: mockRemove,
  };

  const mockMarker = {
    addTo: mockAddTo,
    bindPopup: mockBindPopup,
  };

  return {
    default: {
      map: vi.fn(() => mockMapInstance),
      tileLayer: vi.fn(() => ({ addTo: mockAddTo })),
      marker: vi.fn(() => mockMarker),
      Icon: {
        Default: {
          prototype: {},
          mergeOptions: vi.fn(),
        },
      },
    },
  };
});

vi.mock('leaflet/dist/leaflet.css', () => ({}));

import Map from '../src/components/Map';
import L from 'leaflet';

describe('Map component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('рендерит div-контейнер для карты', () => {
    const { container } = render(<Map />);
    const mapDiv = container.firstElementChild;
    expect(mapDiv).toBeInTheDocument();
    expect(mapDiv?.tagName).toBe('DIV');
  });

  it('применяет className по умолчанию', () => {
    const { container } = render(<Map />);
    const mapDiv = container.firstElementChild as HTMLElement;
    expect(mapDiv.className).toContain('w-full');
    expect(mapDiv.className).toContain('rounded-3xl');
  });

  it('применяет пользовательский className', () => {
    const { container } = render(<Map className="custom-class" />);
    const mapDiv = container.firstElementChild as HTMLElement;
    expect(mapDiv.className).toBe('custom-class');
  });

  it('инициализирует карту Leaflet', () => {
    render(<Map />);
    expect(L.map).toHaveBeenCalled();
  });

  it('добавляет тайловый слой OpenStreetMap', () => {
    render(<Map />);
    expect(L.tileLayer).toHaveBeenCalledWith(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      expect.objectContaining({
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }),
    );
  });

  it('добавляет маркеры для attractions', () => {
    const attractions = [
      {
        title: 'Мечеть Тауба',
        lat: 55.73,
        lng: 52.41,
        address: 'ул. Центральная, 1',
        description: 'Красивая мечеть',
      },
      {
        title: 'Парк Победы',
        lat: 55.72,
        lng: 52.38,
        address: 'просп. Победы',
      },
    ];

    render(<Map attractions={attractions} />);

    expect(L.marker).toHaveBeenCalledTimes(2);
    expect(L.marker).toHaveBeenCalledWith([55.73, 52.41]);
    expect(L.marker).toHaveBeenCalledWith([55.72, 52.38]);
  });

  it('не добавляет маркеры при пустом массиве attractions', () => {
    render(<Map attractions={[]} />);
    expect(L.marker).not.toHaveBeenCalled();
  });
});
