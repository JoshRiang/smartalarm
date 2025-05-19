# this program is the main backend program, data will be sent to front-end
# run this program using: uvicorn main:app --reload
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import serial
app = FastAPI()

# Pastikan React app berjalan di localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get-sleeping-status")
async def get_sleeping_status():
    sleeping_status = {
        "status": "tes",
        "last_time": "2023-10-01T12:00:00Z"
    }
    return sleeping_status

@app.get("/get-sleeping-phase")
async def get_sleeping_phase():
    sleeping_phase = {
        "phase": "rem",
    }
    return sleeping_phase