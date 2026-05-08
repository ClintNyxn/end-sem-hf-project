import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Custom ISS Icon
const issIcon = L.divIcon({
  className: 'custom-iss-icon',
  html: `<div class="w-8 h-8 bg-primary-500 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center">
           <svg viewBox="0 0 24 24" class="w-4 h-4 text-white" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function RecenterMap({ position }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
}

export default function ISSMap({ currentPos, history, loading }) {
  const pathPositions = history.slice(-15).map(p => [p.lat, p.lng]);

  if (loading && !currentPos) {
    return (
      <div className="w-full h-full bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center rounded-3xl">
        <p className="text-slate-500 font-medium">Loading Live Map...</p>
      </div>
    );
  }

  const center = currentPos ? [currentPos.lat, currentPos.lng] : [0, 0];

  return (
    <MapContainer 
      center={center} 
      zoom={3} 
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {currentPos && (
        <>
          <Marker position={[currentPos.lat, currentPos.lng]} icon={issIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold">ISS Position</p>
                <p className="text-xs">Lat: {currentPos.lat.toFixed(4)}</p>
                <p className="text-xs">Lng: {currentPos.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
          <RecenterMap position={currentPos} />
        </>
      )}

      {pathPositions.length > 1 && (
        <Polyline 
          positions={pathPositions} 
          pathOptions={{ color: '#0ea5e9', weight: 4, opacity: 0.6, dashArray: '10, 10' }} 
        />
      )}
    </MapContainer>
  );
}
