import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchRoute } from '../services/routeService';
import type { Mosque, Location, RouteCoordinate } from '../types';

// Fix default marker icons
(L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl = undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const userIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const mosqueIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedMosqueIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [41, 41]
});

interface MapUpdaterProps {
  center: [number, number];
  selectedMosque: Mosque | null;
}

function MapUpdater({ center, selectedMosque }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedMosque) {
      map.setView([selectedMosque.lat, selectedMosque.lon], 16, { animate: true });
    } else {
      map.setView(center, 13, { animate: true });
    }
  }, [center, selectedMosque, map]);

  return null;
}

interface MapProps {
  userLocation: Location;
  mosques: Mosque[];
  selectedMosque: Mosque | null;
  onMosqueClick: (mosque: Mosque) => void;
}

export const Map = ({ userLocation, mosques, selectedMosque, onMosqueClick }: MapProps) => {
  const [routeCoords, setRouteCoords] = useState<RouteCoordinate[]>([]);
  const [routeLoading, setRouteLoading] = useState(false);

  const center: [number, number] = [userLocation.lat, userLocation.lon];

  useEffect(() => {
    if (!selectedMosque) {
      setRouteCoords([]);
      return;
    }

    setRouteLoading(true);
    fetchRoute(
      { lat: userLocation.lat, lon: userLocation.lon, name: '' },
      { lat: selectedMosque.lat, lon: selectedMosque.lon, name: '' }
    )
      .then(coords => setRouteCoords(coords))
      .catch(() => {
        // Fallback: straight line
        setRouteCoords([
          { lat: userLocation.lat, lng: userLocation.lon },
          { lat: selectedMosque.lat, lng: selectedMosque.lon }
        ]);
      })
      .finally(() => setRouteLoading(false));
  }, [selectedMosque, userLocation.lat, userLocation.lon]);

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} selectedMosque={selectedMosque} />

        {/* Direction route polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords.map(c => [c.lat, c.lng] as [number, number])}
            pathOptions={{
              color: '#0f766e',
              weight: 5,
              opacity: 0.85,
              dashArray: undefined,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* User location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="text-center px-1">
              <p className="font-semibold text-sm">Your Location</p>
              <p className="text-xs text-gray-500 mt-0.5">{userLocation.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* Mosque markers */}
        {mosques.map(mosque => {
          const isSelected = selectedMosque?.id === mosque.id;
          return (
            <Marker
              key={mosque.id}
              position={[mosque.lat, mosque.lon]}
              icon={isSelected ? selectedMosqueIcon : mosqueIcon}
              eventHandlers={{ click: () => onMosqueClick(mosque) }}
            >
              <Popup>
                <div className="text-center px-1">
                  <p className="font-semibold text-sm text-islamic-green">{mosque.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{mosque.distanceText} away</p>
                  {mosque.address && (
                    <p className="text-xs text-gray-400 mt-0.5">{mosque.address}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Route loading indicator */}
      {routeLoading && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-islamic-green border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-gray-700">Getting directions...</span>
        </div>
      )}

      {/* Direction badge */}
      {selectedMosque && routeCoords.length > 0 && !routeLoading && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-islamic-green text-white px-4 py-1.5 rounded-full shadow-md flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-xs font-semibold">Walking directions to {selectedMosque.name}</span>
        </div>
      )}
    </div>
  );
};
