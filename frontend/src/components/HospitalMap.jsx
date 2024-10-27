import React, { Component, useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L, { latLng, map, point } from 'leaflet';
import hospitals from '../assets/hospitals.json'
import hospitalPng from '../assets/hospital.png'
import { getDistanceFromLatLonInMiles } from '../helper/helper';

function HospitalIcons(hospitalNearestPoints) {

  const hospitalIcon = L.icon({
    iconUrl: hospitalPng,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -20],
  });

  const map = useMap('map');
  const markersRef = useRef({});

  useEffect(() => {
    console.log('hospitalNearestPointsFUNC:', hospitalNearestPoints);

    if (hospitalNearestPoints.length < 0) return;

    hospitals.forEach((data, index) => {
      const position = latLng(data.latitude, data.longitude);
      const popupContent = (
        `<div>
          <h2>${data.name}</h2>
          <p>Address: ${data.address}</p>
          <p>Distance to closest point: ${!!hospitalNearestPoints[index] ? hospitalNearestPoints[index].distance.toFixed(2) : 'N/A'} miles</p>
          <p>Category: ${!!hospitalNearestPoints[index] ? hospitalNearestPoints[index].point.category : 'N/A'}</p>
        </div>`
      )

      if (markersRef.current[index]) {
        // If marker exists, update position and popup content  
        markersRef.current[index].setLatLng(position).setPopupContent(popupContent);
      } else {
        // Create a new marker if it doesn't already exist
        const newMarker = L.marker(position).addTo(map).bindPopup(popupContent).setIcon(hospitalIcon);
        markersRef.current[index] = newMarker;
      }
    })
  }, [hospitalNearestPoints, map]);

  return( null
    // hospitals.map((hospital, index) => (
    //   <Marker 
    //     key={index}
    //     position={[hospital.latitude, hospital.longitude]}
    //     icon={hospitalIcon}
    //   >
    //     <Popup>
    //       <div>
    //         <h2>{hospital.name}</h2>
    //         <p>Address: {hospital.address}</p>
    //         <p>Distance to closest point: {hospitalNearestPoints[index] ? hospitalNearestPoints[index].distance.toFixed(2) : 'N/A'} miles</p>
    //         <p>Category: {hospitalNearestPoints[index] ? hospitalNearestPoints[index].point.category : 'N/A'}</p>
    //       </div>
    //     </Popup>
    //   </Marker>
    // ))
  )
  
}

function HospitalMap() {

  const [pointsGEO, setPointsGEO] = useState(null)
  const [projectionGEO, setProjectionGEO] = useState(null)
  const [lineGEO, setLineGEO] = useState(null)

  const pointsList = []
  const [hospitalNearestPoints, setHospitalNearestPoints] = useState([])

  const hurricaneID = 'al142024' // Milton

  useEffect(() => {
    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=pts`)
      .then(response => {
        setPointsGEO(JSON.parse(response.data));
        console.log('response:', JSON.parse(response.data))
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=pgn`)
      .then(response => {
        setProjectionGEO(JSON.parse(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/hurricane/${hurricaneID}?type=lin`)
      .then(response => {
        setLineGEO(JSON.parse(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!pointsGEO) return;

    for (let i = 0; i < pointsGEO.features.length; i++) {
      const point = {
        id: pointsGEO.features[i].id,
        lat: pointsGEO.features[i].geometry.coordinates[1],
        lng: pointsGEO.features[i].geometry.coordinates[0],
        category: pointsGEO.features[i].properties['SSNUM'],
      }
      pointsList.push(point);
    }
    
    for (let i = 0; i < hospitals.length; i++) {
      const hLat = hospitals[i].latitude;
      const hLong = hospitals[i].longitude;

      var closestPoint = [Infinity, -1];
      pointsList.forEach((point, index) => {
        const distance = getDistanceFromLatLonInMiles(hLat, hLong, point.lat, point.lng);
        if (distance < closestPoint[0]) {
          closestPoint = [distance, index];
        }
      });

      if (closestPoint[1] === -1) {
        console.log('No closest point found');
        continue;
      }

      if (closestPoint[0] > 250) { // discard hospitals that are 300 miles away from the closest point
        console.log(`Closest point for ${hospitals[i].name} is too far away`);
        continue;
      }

      // hospitalNearestPoints.push({
      //   hospital: hospitals[i],
      //   hospitalIndex: i,
      //   point: pointsList[closestPoint[1]],
      //   distance: closestPoint[0],
      // });

      setHospitalNearestPoints(prevState => [...prevState, {
        hospital: hospitals[i],
        hospitalIndex: i,
        point: pointsList[closestPoint[1]],
        distance: closestPoint[0],
      }]);
    }
    console.log('hospitalNearestPoints:', hospitalNearestPoints);
  }, [pointsGEO]);
    
  return (  
    <>
    {<MapContainer 
      whenReady={() => {
      console.log('points', pointsGEO)
    }} 
      id='map' style={{height: '100vh'}} center={[29.651634, -82.324829]} zoom={10} >
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
        minZoom={0} 
	      maxZoom= {10}
        ext='png'
      />
      {
        <HospitalIcons hospitalNearestPoints={hospitalNearestPoints}/>
      }
      {pointsGEO && <GeoJSON data={pointsGEO} key={JSON.stringify(pointsGEO)} interactive={false}/>}
      {projectionGEO && <GeoJSON data={projectionGEO} key={JSON.stringify(projectionGEO)} interactive={false}/>}
      {lineGEO && <GeoJSON data={lineGEO} key={JSON.stringify(lineGEO)} interactive={false}/>}
    </MapContainer> }
    </>
    
  ) 
}

export default HospitalMap; 
