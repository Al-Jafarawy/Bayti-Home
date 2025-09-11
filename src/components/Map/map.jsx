// src/components/Map/Map.jsx
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.style.css";

const customIcon = new L.Icon({
  iconUrl: "/images/marker-icon.png",  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationMap({ lat , lng  }) {
  const position = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="MapContainer"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon} />
    </MapContainer>
  );
}
