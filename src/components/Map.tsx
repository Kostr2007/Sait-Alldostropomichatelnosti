import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// Исправляем дефолтные иконки Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Attraction {
  title: string;
  lat: number;
  lng: number;
  address: string;
  description?: string;
  category?: string;
}

interface MapProps {
  attractions?: Attraction[];
  className?: string;
  center?: [number, number];
  zoom?: number;

  // Astro-директивы (чтобы TypeScript не ругался)
  'client:load'?: boolean;
  'client:only'?: 'react' | 'vue' | 'svelte' | 'preact' | 'solid';
  'client:idle'?: boolean;
  'client:visible'?: boolean;
}

export default function Map({
  attractions = [],
  className = 'w-full h-162.5 rounded-3xl',
  center = [55.725, 52.39], // Центр Набережных Челнов
  zoom = 12,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Создаём карту
    mapInstance.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(center, zoom);

    // Базовый слой OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Добавляем маркеры
    attractions.forEach((attr) => {
      const marker = L.marker([attr.lat, attr.lng]).addTo(mapInstance.current!);

      marker.bindPopup(
        `
        <div class="text-sm">
          <b>${escapeHtml(attr.title)}</b><br>
          <span class="text-gray-600">${escapeHtml(attr.address)}</span><br><br>
          ${attr.description ? `<small>${escapeHtml(attr.description)}</small>` : ''}
        </div>
      `,
        {
          closeButton: true,
          className: 'custom-popup',
        },
      );
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [attractions, center, zoom]);

  return <div ref={mapRef} className={className} />;
}
