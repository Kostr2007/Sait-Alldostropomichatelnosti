import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Исправляем дефолтные иконки Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
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
  "client:load"?: boolean;
  "client:only"?: "react" | "vue" | "svelte" | "preact" | "solid";
  "client:idle"?: boolean;
  "client:visible"?: boolean;
}

function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export default function Map({
  attractions = [],
  className = "w-full h-162.5 rounded-3xl",
  center = [55.725, 52.39], // Центр Набережных Челнов
  zoom = 12,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    try {
      // Создаём карту
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView(center, zoom);

      // Базовый слой OpenStreetMap
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        },
      );

      tileLayer.on("tileerror", (event) => {
        console.error("Ошибка загрузки тайла карты:", event.coords);
      });

      tileLayer.addTo(mapInstance.current);

      // Добавляем маркеры
      attractions.forEach((attr) => {
        if (!isValidCoordinate(attr.lat, attr.lng)) {
          console.error(
            `Некорректные координаты для "${attr.title}": lat=${attr.lat}, lng=${attr.lng}`,
          );
          return;
        }

        const marker = L.marker([attr.lat, attr.lng]).addTo(
          mapInstance.current!,
        );

        marker.bindPopup(
          `
          <div class="text-sm">
            <b>${attr.title}</b><br>
            <span class="text-gray-600">${attr.address}</span><br><br>
            ${attr.description ? `<small>${attr.description}</small>` : ""}
          </div>
        `,
          {
            closeButton: true,
            className: "custom-popup",
          },
        );
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Не удалось загрузить карту";
      console.error("Ошибка инициализации карты:", err);
      setMapError(message);
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [attractions, center, zoom]);

  if (mapError) {
    return (
      <div className={className + " flex items-center justify-center bg-surface border border-border"}>
        <p className="text-text-secondary text-center p-4">
          Не удалось загрузить карту: {mapError}
        </p>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}
