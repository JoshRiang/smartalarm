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
# Inisialisasi koneksi serial ke Arduino
# arduino = serial.Serial('COM5', 9600) # comment ini jika belum dicolok
@app.get("/")
async def root():
    return {"message": "Hello World"}
@app.get("/get-sleeping-status")
async def get_sleeping_status():
    # Simulasi status tidur
    sleeping_status = {
        "status": "tes",
        "last_time": "2023-10-01T12:00:00Z"
    }
    return sleeping_status
@app.get("/get-sleeping-phase")
async def get_sleeping_phase():
    # Simulasi fase tidur
    sleeping_phase = {
        "phase": "rem",
    }
    return sleeping_phase