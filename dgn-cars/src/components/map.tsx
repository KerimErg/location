"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { SITE } from "@/config/site";

const pin = L.divIcon({
  className: "",
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  html: `<svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg"><path d="M17 41S32 27 32 16A15 15 0 0 0 2 16c0 11 15 25 15 25z" fill="#FFC300" stroke="#1C1F22" stroke-width="2"/><rect x="11" y="10" width="12" height="12" fill="#1C1F22"/></svg>`,
});

export default function GarageMap() {
  const pos: [number, number] = [SITE.address.lat, SITE.address.lng];
  return (
    <MapContainer center={pos} zoom={15} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos} icon={pin} />
    </MapContainer>
  );
}
