import "./App.css";
import { useState, useEffect, useContext } from "react";
import { SleepStatusContext, SleepStatusProvider } from "./SleepStatusContext";

function StatusDisplay() {
  const { isSleeping } = useContext(SleepStatusContext);

  return <h2>{isSleeping}</h2>;
}

function MainClock() {
  const [clock, setClock] = useState("Loading...");

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8000/get-clock")
        .then((res) => res.json())
        .then((data) => setClock(data.time))
        .catch((err) => console.error("Error fetching clock:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <h1>{clock}</h1>;
}

function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      fetch(`http://localhost:8000/get-weather?lat=${latitude}&lon=${longitude}`)
        .then((res) => res.json())
        .then((data) => {
          setWeather(data);
        })
        .catch((err) => console.error("Error fetching combined weather:", err));
    });
  }, []);

  if (!weather) {
    return <div>Loading weather...</div>;
  }

  return (
    <div>
      <h2>Cuaca di {weather.city}, {weather.province} </h2>
      <p>{weather.icon}</p>
      <p>Suhu: {weather.temperature}&deg;C</p>
      <p>Kondisi: {weather.description}</p>
    </div>
  );
}

function App() {
  return (
    <SleepStatusProvider>
      <div className="App">
        <Weather />
        <MainClock />
        <StatusDisplay />
      </div>
    </SleepStatusProvider>
  );
}

export default App;
