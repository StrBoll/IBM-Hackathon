from fastapi import FastAPI, Response, Request
from starlette.middleware.cors import CORSMiddleware

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
