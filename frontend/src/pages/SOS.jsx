import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/joy';
import L from 'leaflet';


const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [15, 25], 
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

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
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    if (position) {
      const fetchHospitals = async () => {
        try {
          const response = await fetch(
            `https://overpass-api.de/api/interpreter?data=[out:json];node(around:5000,${position.lat},${position.lng})[amenity=hospital];out;`
          );
          const data = await response.json();
          setHospitals(data.elements); 
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      };
      fetchHospitals();
    }
  }, [position]);

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

\          {hospitals.map((hospital, index) => (
  <Marker
    key={index}
    position={[hospital.lat, hospital.lon]} 
    icon={redIcon} 
  >
    <Popup>
      <Typography>{hospital.tags && hospital.tags.name ? hospital.tags.name : 'Unknown Hospital'}</Typography>
    </Popup>
  </Marker>
))}

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
