from fastapi import FastAPI, Response, Request, HTTPException
from starlette.middleware.cors import CORSMiddleware
import requests
import zipfile
from io import BytesIO
import geopandas as gpd
import os
from model import get_predictions
from cnn_model import CNNModel

app = FastAPI()

origins = ["http://localhost:5173", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"Hello": "world!"}


@app.get("/api/encounters")
def get_encounter_predictions():
    try:
        predictions = get_predictions()
        return {"predictions": predictions.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/hurricane/{storm_id}")
async def get_hurricane_geojson(storm_id: str):

    url = f"https://www.nhc.noaa.gov/gis/forecast/archive/{storm_id}_5day_001.zip"

    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail="Error downloading zip file") from e

    # Step 2: Extract the ZIP file
    with zipfile.ZipFile(BytesIO(response.content)) as zip_ref:
        zip_ref.extractall("temp_shapefiles")

    # Find the shapefile (.shp file) path
    shapefile_path1 = None
    for root, dirs, files in os.walk("temp_shapefiles"):
        for file in files:
            if file.endswith("pts.shp"):
                shapefile_path = os.path.join(root, file)
                break

    if shapefile_path is None:
        raise HTTPException(status_code=400, detail="Shapefile not found in the ZIP file")

    # Step 3: Load shapefiles using GeoPandas and convert to GeoJSON
    try:
        gdf = gpd.read_file(shapefile_path)
        geojson_obj = gdf.to_json()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error converting shapefile to GeoJSON") from e
    finally:
        # Cleanup extracted files
        for root, dirs, files in os.walk("temp_shapefiles", topdown=False):
            for file in files:
                os.remove(os.path.join(root, file))
            for dir in dirs:
                os.rmdir(os.path.join(root, dir))
        os.rmdir("temp_shapefiles")


    # Return GeoJSON object
    return geojson_obj

#@app.get("/api/hurricanetrack/{storm_id}")
#async def get_hurricane_geojson(storm_id: str):
#
#    url = f"https://www.nhc.noaa.gov/gis/best_track/{storm_id}_best_track.zip"
#
#    try:
#        response = requests.get(url)
#        response.raise_for_status()
#    except requests.RequestException as e:
#        raise HTTPException(status_code=400, detail="Error downloading zip file") from e
#
#    # Step 2: Extract the ZIP file
#    with zipfile.ZipFile(BytesIO(response.content)) as zip_ref:
#        zip_ref.extractall("temp_shapefiles")
#
#    # Find the shapefile (.shp file) path
#    shapefile_path1 = None
#    for root, dirs, files in os.walk("temp_shapefiles"):
#        for file in files:
#            if file.endswith(".shp"):
#                shapefile_path = os.path.join(root, file)
#                break
#
#    if shapefile_path is None:
#        raise HTTPException(status_code=400, detail="Shapefile not found in the ZIP file")
#
#    # Step 3: Load shapefiles using GeoPandas and convert to GeoJSON
#    try:
#        gdf = gpd.read_file(shapefile_path)
#        geojson_obj = gdf.to_json()
#    except Exception as e:
#        raise HTTPException(status_code=500, detail="Error converting shapefile to GeoJSON") from e
#    finally:
#        # Cleanup extracted files
#        for root, dirs, files in os.walk("temp_shapefiles", topdown=False):
#            for file in files:
#                os.remove(os.path.join(root, file))
#            for dir in dirs:
#                os.rmdir(os.path.join(root, dir))
#        os.rmdir("temp_shapefiles")
#
#    # Return GeoJSON object
#    return geojson_obj




