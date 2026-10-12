"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export type MapAgency = { slug: string; name: string; address: string; postalCode: string; city: string; latitude: number; longitude: number; phone: string; hours: string };

const pin = (active: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
    html: `<svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));transition:transform .2s;transform:scale(${active ? 1.18 : 1});transform-origin:bottom center">
      <path d="M18 43s15-13.3 15-25A15 15 0 0 0 3 18c0 11.7 15 25 15 25z" fill="${active ? "#0A0A0A" : "#FF5F00"}" stroke="#fff" stroke-width="2"/>
      <circle cx="18" cy="18" r="5.5" fill="#fff"/></svg>`,
  });

function FlyTo({ agency }: { agency?: MapAgency }) {
  const map = useMap();
  useEffect(() => {
    if (agency) map.flyTo([agency.latitude, agency.longitude], 12, { duration: 1.2 });
  }, [agency, map]);
  return null;
}

function FitAll({ agencies }: { agencies: MapAgency[] }) {
  const map = useMap();
  useEffect(() => {
    if (agencies.length) map.fitBounds(L.latLngBounds(agencies.map((a) => [a.latitude, a.longitude])), { padding: [40, 40] });
  }, [agencies, map]);
  return null;
}

export default function AgencyMap({ agencies, selected, onSelect }: { agencies: MapAgency[]; selected?: string; onSelect?: (slug: string) => void }) {
  const active = agencies.find((a) => a.slug === selected);
  return (
    <MapContainer center={[46.6, 2.4]} zoom={6} scrollWheelZoom={false} className="h-full w-full" attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitAll agencies={agencies} />
      <FlyTo agency={active} />
      {agencies.map((a) => (
        <Marker key={a.slug} position={[a.latitude, a.longitude]} icon={pin(a.slug === selected)} eventHandlers={{ click: () => onSelect?.(a.slug) }}>
          <Popup>
            <strong>{a.name}</strong>
            <br />
            {a.address}, {a.postalCode} {a.city}
            <br />
            {a.hours}
            <br />
            <a href={`/vehicules?pickupAgency=${a.slug}`}>Réserver ici →</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
