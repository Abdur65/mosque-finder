import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const mosqueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when location changes
function MapUpdater({ center, selectedMosque }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedMosque) {
      map.setView([selectedMosque.lat, selectedMosque.lon], 16);
    } else {
      map.setView(center, 13);
    }
  }, [center, selectedMosque, map]);
  
  return null;
}

export const Map = ({ userLocation, mosques, selectedMosque, onMosqueClick }) => {
  if (!userLocation) return null;

  const center = [userLocation.lat, userLocation.lon];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
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
        
        {/* User location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Your Location</p>
              <p className="text-sm text-gray-600">{userLocation.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* Mosque markers */}
        {mosques.map((mosque) => (
          <Marker
            key={mosque.id}
            position={[mosque.lat, mosque.lon]}
            icon={mosqueIcon}
            eventHandlers={{
              click: () => onMosqueClick(mosque)
            }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-islamic-green">{mosque.name}</p>
                <p className="text-sm text-gray-600">{mosque.distanceText} away</p>
                {mosque.address && (
                  <p className="text-xs text-gray-500 mt-1">{mosque.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};