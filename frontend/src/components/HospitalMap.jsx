import React, { Component } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function HospitalMap() {

  var geojson = {
    "type": "FeatureCollection",
    "name": "ep122024-020_5day_lin",
    "features": [
        { "type": "Feature", "properties": { "STORMNAME": "Kristy", "STORMTYPE": "HU", "ADVDATE": "800 AM PDT Sat Oct 26 2024", "ADVISNUM": "20", "STORMNUM": 12.0, "FCSTPRD": 120.0, "BASIN": "EP" }, "geometry": { "type": "LineString", "coordinates": [ [ -128.4, 19.7 ], [ -129.2, 21.1 ], [ -130.0, 22.3 ], [ -131.0, 22.5 ], [ -132.2, 21.9 ] ] } }
    ]
    }

   

  return (
    <MapContainer className='map' center={[29.651634, -82.324829]} zoom={13} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      <Marker position={[29.651634, -82.324829]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
  </MapContainer>
  );
}

export default HospitalMap;
