import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/joy';

const LocationMarker = ({ setPosition, position }) => {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.error('Location permissions probably off');
      }
    );
  }, [setPosition]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <Typography>Your Location</Typography>
      </Popup>
    </Marker>
  );
};

const SOS = () => {
  const [position, setPosition] = useState(null);

  return (
    <Box sx={{ height: '100vh' }}>
      <Typography level="h1" sx={{ textAlign: 'center', mt: 4 }}>
        Predicted Emergency Response Natural Disasters
      </Typography>
      <Typography level="body1" sx={{ textAlign: 'center', mt: 2 }}>
        Your location will be automatically detected and pinned on the map.
      </Typography>

      <Box sx={{ height: '60vh', marginTop: 4 }}>
        <MapContainer
          center={[37, -95]} 
          zoom={4} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            ext="png"
            minZoom={0}
            maxZoom={20}
          />
          <LocationMarker setPosition={setPosition} position={position} />
        </MapContainer>
      </Box>

      {position && (
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Typography>Your current location is: {position.lat}, {position.lng}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default SOS;
