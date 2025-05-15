# About This Project
Sleep quality is determined by the quality of waking up. By creating a smart alarm, which can detect sleep phases, we can improve the quality of waking up. So this project focuses on detecting the user's sleep phase through movement. Then through a series of systems using Machine Learning technology, we can determine the right time to wake up the user without surprising them. Current features:
- Motor connected to ESP32 used to open the window curtain.
- White noise to improve sleep quality.
- Nature background sound to simulate early morning situation.
- Alarm sound.

# Project Structure and Setup Guide

This repository contains a modular project composed of three main components:

- **WebsiteFiles** – Full-stack web application (front-end and back-end)
- **ArduinoFiles** – Embedded systems code for Arduino
- **Konsep** – Conceptual documentation and project description

---

## Project Structure
ProjectRoot/
│
├── WebsiteFiles/
│ ├── back-end/ # FastAPI-based Python backend
│ └── front-end/ # React + Tailwind (Vite-based) frontend
│
├── ArduinoFiles/ # Arduino IDE source files
└── Konsep/ # Conceptual project documentation

---

## Prerequisites

- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js (v16 or newer)](https://nodejs.org/)
- [Arduino IDE](https://www.arduino.cc/en/software)

---

## Back-End Setup (FastAPI - Python)

> Use a virtual environment (Recommended)

# Navigate to the back-end directory
cd WebsiteFiles/back-end

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload

---
## Front-End Setup (React + Tailwind)

# Navigate to the front-end directory
cd WebsiteFiles/front-end

# Install dependencies
npm install

# Start the development server
npm run dev
>The front-end will be served at http://localhost:5173 by default.

----