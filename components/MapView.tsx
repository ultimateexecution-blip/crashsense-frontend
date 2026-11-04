"use client";
import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Resource } from "@/lib/types";

const colour = { hospital: "#2c7a4b", police: "#0f3d5e", fire: "#d98a12" } as const;

interface Props {
  center: [number, number];
  accident?: { lat: number; lng: number; label: string };
  resources: Resource[];
  height?: number;
}

export default function MapView({ center, accident, resources, height = 320 }: Props) {
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height, width: "100%", borderRadius: 8 }}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {resources.map((r) => (
        <CircleMarker key={r.id} center={[r.lat, r.lng]} radius={8} pathOptions={{ color: colour[r.type], fillOpacity: 0.85 }}>
          <Popup><strong>{r.name}</strong><br />{r.type} · {r.phone}</Popup>
        </CircleMarker>
      ))}
      {accident && (
        <CircleMarker center={[accident.lat, accident.lng]} radius={12} pathOptions={{ color: "#c8312b", fillColor: "#c8312b", fillOpacity: 0.6 }}>
          <Popup>{accident.label}</Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
