# AIDays2024

## Running the project

Note: we ran into some issues with deploying with Docker so it's a little more cubersome to deploy. 
You will need at least two terminals open. 

1. First clone the repo. 
2. Navigate into the cloned directory. 
3. Open another terminal in the same directory. 
4. From one terminal navigate into the frontend directory and run ```pnpm install```and ```pnpm run dev```. It is required that you have pnpm installed and if not run ```npm install -g pnpm```. 
5. From the other terminal navigate into the backend directory and run ```pip install -r requirements.txt``` for dependencies. After run ```uvicorn main:app --host 0.0.0.0 --port 8000 --reload``` 
6. Once each is up and running, go to http://localhost:5173 in a browser and the app should be running.


