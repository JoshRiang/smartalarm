import "./App.css";
import { useState, useEffect, useContext } from "react";
import { SleepStatusContext, SleepStatusProvider } from "./SleepStatusContext";

function StatusDisplay() {
  const { isSleeping } = useContext(SleepStatusContext);

  return <h2>{isSleeping}</h2>

  if (isSleeping === null) {
    return <h2>Mengecek status tidur...</h2>;
  }

  return <h2>Pengguna sedang {isSleeping ? "💤 tidur" : "✅ bangun"}</h2>;
}

function App() {
  return (
    <SleepStatusProvider>
      <div className="App">
        <StatusDisplay />
      </div>
    </SleepStatusProvider>
  );
}

export default App;
