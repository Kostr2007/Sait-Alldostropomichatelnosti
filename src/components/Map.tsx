import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Исправляем иконки Leaflet (важный момент!)
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
}

export default function Map({
  attractions = [],
}: {
  attractions?: Attraction[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Центр Набережных Челнов
    mapInstance.current = L.map(mapRef.current).setView([55.725, 52.39], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Добавляем маркеры
    attractions.forEach((attr) => {
      L.marker([attr.lat, attr.lng]).addTo(mapInstance.current!).bindPopup(`
          <b>${attr.title}</b><br>
          ${attr.address}<br>
          <small>${attr.description || ""}</small>
        `);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [attractions]);

  return <div ref={mapRef} className="w-full h-150 rounded-3xl" />;
}
