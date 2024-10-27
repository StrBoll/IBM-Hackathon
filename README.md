# Atlas

## Running the project

Note: we ran into some issues with deploying with Docker so it's a little more cubersome to deploy. 
You will need at least two terminals open. You will also need to provide api keys and a project_id to use the WatsonX AI in a ```.env``` file in the backend directory. 

1. First clone the repo. 
2. Navigate into the cloned directory. 
3. Open another terminal in the same directory. 
4. From one terminal navigate into the frontend directory and run ```pnpm install```and ```pnpm run dev```. It is required that you have pnpm installed and if not run ```npm install -g pnpm```. 
5. From the other terminal navigate into the backend directoyr and create a ```.env``` file and create two keys: ```WATSON_KEY="api_key"``` and ```PROJECT_ID="app_id"```.
6. Then run ```pip install -r requirements.txt``` for dependencies. After run ```uvicorn main:app --host 0.0.0.0 --port 8000 --reload``` 
7. Once each is up and running, go to http://localhost:5173 in a browser and the app should be running.


