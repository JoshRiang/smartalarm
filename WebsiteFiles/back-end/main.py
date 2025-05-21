# this program is the main backend program, data will be sent to front-end
# run this program using: uvicorn main:app --reload
from fastapi import FastAPI, requests, Query
from fastapi.middleware.cors import CORSMiddleware
import serial
from clock import Clock
import httpx

app = FastAPI()

# Pastikan React app berjalan di localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clock = Clock("120000")  # waktu awal jam 12:00:00
clock.start()

WEATHER_CODE_MAP = {
    0: ("Clear", "fas fa-sun"),
    1: ("Partly clear", "fas fa-cloud-sun"),
    2: ("Partly cloudy", "fas fa-cloud-sun"),
    3: ("Cloudy", "fas fa-cloud"),
    45: ("Fog", "fas fa-smog"),
    48: ("Fog with frost", "fas fa-snowflake"),
    51: ("Light drizzle", "fas fa-cloud-showers-heavy"),
    53: ("Moderate drizzle", "fas fa-cloud-showers-heavy"),
    55: ("Heavy drizzle", "fas fa-cloud-showers-heavy"),
    56: ("Light freezing drizzle", "fas fa-snowflake"),
    57: ("Heavy freezing drizzle", "fas fa-snowflake"),
    61: ("Light rain", "fas fa-cloud-rain"),
    63: ("Moderate rain", "fas fa-cloud-rain"),
    65: ("Heavy rain", "fas fa-cloud-showers-heavy"),
    66: ("Light freezing rain", "fas fa-snowflake"),
    67: ("Heavy freezing rain", "fas fa-snowflake"),
    80: ("Local light rain", "fas fa-cloud-sun-rain"),
    81: ("Local moderate rain", "fas fa-cloud-sun-rain"),
    82: ("Local heavy rain", "fas fa-cloud-showers-heavy"),
    95: ("Thunderstorm", "fas fa-bolt"),
}

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

@app.get("/get-clock")
async def get_clock():
    return {"time": clock.get_time()}

@app.get("/get-weather")
async def get_weather(lat: float = Query(...), lon: float = Query(...)):
    async with httpx.AsyncClient() as client:
        # Ambil cuaca
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        weather_res = await client.get(weather_url)
        weather_data = weather_res.json()

        # Ambil nama kota
        geo_url = f"https://geocode.maps.co/reverse?lat={lat}&lon={lon}&api_key=682d38a99e3f4855584648gczce5351"
        geo_res = await client.get(geo_url)
        geo_data = geo_res.json()

        weather_code = weather_data["current_weather"]["weathercode"]
        value = WEATHER_CODE_MAP.get(weather_code, ("Tidak diketahui", "fas fa-question"))

        if isinstance(value, tuple) and len(value) == 2:
            description, icon = value
        else:
            description, icon = "Tidak diketahui", "fas fa-question"
            
    return {
        "temperature": weather_data["current_weather"]["temperature"],
        "description": description,
        "icon": icon,
        "city": geo_data.get("address", {}).get("city") or "Tidak diketahui",
        "province": geo_data.get("address", {}).get("state") or "Tidak diketahui",  
    }