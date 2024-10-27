import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import hospitals from '../assets/hospitals.json';
import hospitalPng from '../assets/hospital.png';
import specialPng from '../assets/special.png'; 
import userLocationIconPng from '../assets/users.png';
import { getDistanceFromLatLonInMiles } from '../helper/helper';

function HospitalIcons({ hospitalNearestPoints, closestHospitalIndex }) {
  const hospitalIcon = L.icon({
    iconUrl: hospitalPng,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -20],
  });

  const specialIcon = L.icon({
    iconUrl: specialPng, 
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -25],
  });

  return (
    <>
      {hospitalNearestPoints.map((hospitalData, index) => {
        const position = [hospitalData.hospital.latitude, hospitalData.hospital.longitude];
        const icon = index === closestHospitalIndex ? specialIcon : hospitalIcon;

        const distance = hospitalData.distance;
        const lowEstimate = (distance / 60) * 60 + 1; // 60 mph + low end average of 1 minute for cities ambulance dispatch
        const highEstimate = (distance / 45) * 60 + 2; // 45 mph + high end average of 2 minute for cities ambulance dispatch

        return (
          <Marker key={index} position={position} icon={icon}>
            <Popup>
              <div>
                <h2>{hospitalData.hospital.name}</h2>
                <p>Address: {hospitalData.hospital.address}</p>
                <p>
                  Distance from your location:{" "}
                  {hospitalData ? `${hospitalData.distance.toFixed(2)} miles` : "N/A"}
                </p>
                <p>
                  Expected Ambulance Response Time:{" "}
                  {hospitalData
                    ? `${lowEstimate.toFixed(2)} to ${highEstimate.toFixed(2)} minutes`
                    : "N/A"}
                </p>
                <p>
                  Category:{" "}
                  {hospitalData.point && hospitalData.point.category
                    ? hospitalData.point.category
                    : "N/A"}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

function HospitalMap() {
  const [pointsGEO, setPointsGEO] = useState(null);
  const [projectionGEO, setProjectionGEO] = useState(null);
  const [lineGEO, setLineGEO] = useState(null);
  const [hospitalNearestPoints, setHospitalNearestPoints] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [closestHospitalIndex, setClosestHospitalIndex] = useState(null); 
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

  // Fetch hurricane data
  useEffect(() => {
    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=pts`)
      .then((response) => {
        setPointsGEO(JSON.parse(response.data));
      })
      .catch((error) => console.log(error));

    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=pgn`)
      .then((response) => {
        setProjectionGEO(JSON.parse(response.data));
      })
      .catch((error) => console.log(error));

    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=lin`)
      .then((response) => {
        setLineGEO(JSON.parse(response.data));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (!pointsGEO || !userPosition) return;

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
    let closestDistance = Infinity;
    let closestIndex = -1;

    hospitals.forEach((hospital, i) => {
      const hLat = hospital.latitude;
      const hLng = hospital.longitude;

      const distance = getDistanceFromLatLonInMiles(userPosition.lat, userPosition.lng, hLat, hLng);
      tempArray.push({
        hospital,
        hospitalIndex: i,
        point: pointsList[i],
        distance,
      });

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setHospitalNearestPoints(tempArray);
    setClosestHospitalIndex(closestIndex); 
  }, [pointsGEO, userPosition]);

  const userIcon = L.icon({
    iconUrl: userLocationIconPng, 
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

      <HospitalIcons hospitalNearestPoints={hospitalNearestPoints} closestHospitalIndex={closestHospitalIndex} />

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