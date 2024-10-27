import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import hospitals from '../assets/hospitals.json';
import hospitalPng from '../assets/hospital.png';
import userLocationIconPng from '../assets/users.png'; // Custom icon for user location
import { getDistanceFromLatLonInMiles } from '../helper/helper';

function HospitalIcons({ hospitalNearestPoints }) {
  const hospitalIcon = L.icon({
    iconUrl: hospitalPng,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -20],
  });

  const map = useMap();
  const markersRef = useRef({});

  useEffect(() => {
    hospitals.forEach((data, index) => {
      const position = L.latLng(data.latitude, data.longitude);
      const popupContent = `
        <div>
          <h2>${data.name}</h2>
          <p>Address: ${data.address}</p>
          <p>Distance to closest point: ${
            !!hospitalNearestPoints[index]
              ? hospitalNearestPoints[index].distance.toFixed(2)
              : 'N/A'
          } miles</p>
          <p>Category: ${
            !!hospitalNearestPoints[index]
              ? hospitalNearestPoints[index].point.category
              : 'N/A'
          }</p>
        </div>
      `;

      if (markersRef.current[index]) {
        markersRef.current[index].setLatLng(position).setPopupContent(popupContent);
      } else {
        const newMarker = L.marker(position).addTo(map).bindPopup(popupContent).setIcon(hospitalIcon);
        markersRef.current[index] = newMarker;
      }
    });
  }, [hospitalNearestPoints, map]);

  return null;
}

function HospitalMap() {
  const [pointsGEO, setPointsGEO] = useState(null);
  const [projectionGEO, setProjectionGEO] = useState(null);
  const [lineGEO, setLineGEO] = useState(null);
  const [hospitalNearestPoints, setHospitalNearestPoints] = useState([]);
  const [userPosition, setUserPosition] = useState(null); 
  const hurricaneID = 'al142024'; 

  const pointsList = [];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.error('Error getting user location.');
      }
    );
  }, []);


  useEffect(() => {
    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=pts`).then((response) => {
      setPointsGEO(JSON.parse(response.data));
    }).catch((error) => console.log(error));

    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=pgn`).then((response) => {
      setProjectionGEO(JSON.parse(response.data));
    }).catch((error) => console.log(error));

    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=lin`).then((response) => {
      setLineGEO(JSON.parse(response.data));
    }).catch((error) => console.log(error));
  }, []);

  // Calculate nearest hospital points
  useEffect(() => {
    if (!pointsGEO) return;

    for (let i = 0; i < pointsGEO.features.length; i++) {
      const point = {
        id: pointsGEO.features[i].id,
        lat: pointsGEO.features[i].geometry.coordinates[1],
        lng: pointsGEO.features[i].geometry.coordinates[0],
        category: pointsGEO.features[i].properties['SSNUM'],
      };
      pointsList.push(point);
    }

    const tempArray = [];
    hospitals.forEach((hospital, i) => {
      const hLat = hospital.latitude;
      const hLng = hospital.longitude;
      let closestPoint = [Infinity, -1];

      pointsList.forEach((point, index) => {
        const distance = getDistanceFromLatLonInMiles(hLat, hLng, point.lat, point.lng);
        if (distance < closestPoint[0]) {
          closestPoint = [distance, index];
        }
      });

      if (closestPoint[1] !== -1) {
        tempArray.push({
          hospital,
          hospitalIndex: i,
          point: pointsList[closestPoint[1]],
          distance: closestPoint[0],
        });
      }
    });

    setHospitalNearestPoints(tempArray);
  }, [pointsGEO]);

  // User's custom icon
  const userIcon = L.icon({
    iconUrl: userLocationIconPng, // Custom icon for user's location
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  return (
    <MapContainer id="map" style={{ height: '100vh' }} center={[29.651634, -82.324829]} zoom={10}>
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
        minZoom={0}
        maxZoom={10}
        ext="png"
      />

      <HospitalIcons hospitalNearestPoints={hospitalNearestPoints} />

      
      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

     
      {pointsGEO && <GeoJSON data={pointsGEO} key={JSON.stringify(pointsGEO)} interactive={false} />}
      {projectionGEO && <GeoJSON data={projectionGEO} key={JSON.stringify(projectionGEO)} interactive={false} />}
      {lineGEO && <GeoJSON data={lineGEO} key={JSON.stringify(lineGEO)} interactive={false} />}
    </MapContainer>
  );
}

export default HospitalMap;
