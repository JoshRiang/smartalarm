import "./App.css";
import { useRef, useState, useEffect, useContext } from "react";
import { SleepStatusContext, SleepStatusProvider } from "./SleepStatusContext";

function StatusDisplay() {
  const { isSleeping } = useContext(SleepStatusContext);

  return <></>;

  // return (
  //   <h2>
  //     User is <i className="text-white">{isSleeping}</i>
  //   </h2>
  // );
}

function MainClock() {
  const [clock, setClock] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8000/get-clock")
        .then((res) => res.json())
        .then((data) => setClock(data.time))
        .catch((err) => console.error("Error fetching clock:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!clock) {
    return <div className="loading-spinner"></div>;
  }

  const formattedClock = typeof clock === "string" && clock.length === 6 ? `${clock.slice(0, 2)}:${clock.slice(2, 4)}` : clock;

  return <h1 className="text-white text-[96px] font-bold">{formattedClock}</h1>;
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
    return <div className="loading-spinner mt-8"></div>;
  }

  return (
    <div className="flex flex-row items-center w-[70%] justify-center gap-x-5 mt-5 p-2 md:justify-start">
      <i className={`${weather.icon} text-6xl text-white drop-shadow-[0_0_12px_rgba(255,230,100,0.3)]`}></i>
      <div className="flex flex-col">
        <div className="leading-5">
          <p className="text-[14px] font-semibold">{weather.description}</p>
          <p className="text-[24px] font-bold text-white">{weather.temperature}&deg; C</p>
        </div>
        <div className="leading-3.5 mt-2">
          <p className="text-[12px] text-white font-medium">
            {weather.city}, {weather.province}
          </p>
          <p className="text-[11px] text-white/70 font-extralight">{new Date().toLocaleDateString("en-EN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>
    </div>
  );
}

function AlarmSelector() {
  const scrollRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const alarmTypes = [
    { title: "Soft Sound", description: "Wake up slowly with gentle sounds" },
    { title: "Vibration", description: "Wake up with gentle vibration" },
    { title: "Loud Sound", description: "Wake up instantly with loud sound" },
    { title: "Loud Sound", description: "Wake up instantly with loud sound" },
    { title: "Loud Sound", description: "Wake up instantly with loud sound" },
  ];

  const handleScroll = () => {
    const container = scrollRef.current;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    const children = Array.from(container.children);
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setSelectedIndex(closestIndex);
  };

  useEffect(() => {
    const container = scrollRef.current;
    handleScroll(); // inisialisasi agar langsung sinkron
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="p-6 text-white w-full md:w-[70%] ">
      <p className="text-[18px] font-semibold">Jenis alarm</p>
      <p className="text-[12px] mb-4">Pilih jenis alarm sesuai yang kamu rasa nyaman. Akan menentukan bagaimana cara kamu bangun.</p>

      {/* Scrollable container */}
      <div ref={scrollRef} className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
        {alarmTypes.map((alarm, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`snap-center flex-shrink-0 rounded-3xl w-64 md:w-80 h-32 p-4 cursor-pointer transition-all duration-300
              ${selectedIndex === i ? "bg-white text-black shadow-xl" : "bg-white/50 text-black/80"}`}
          >
            <p className="text-lg font-bold">{alarm.title}</p>
            <p className="text-sm">{alarm.description}</p>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="flex justify-center mt-4">
        <div className="animate-bounce text-white text-xl">⌄</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SleepStatusProvider>
      <div className="w-full flex flex-col justify-between items-center h-screen ">
        {/* START CONTENT */}
        <Weather />
        <div className="flex flex-col w-[70%] wrap-anywhere items-center ">
          <MainClock />
          <StatusDisplay />
          <p>Alarm in 7 hour 30 minute</p>
        </div>
        {/* <div className="text-center">
          <p>Bangunkan saya jam:</p>
          <p className="font-bold text-3xl text-white">20:00</p>
        </div> */}
        <AlarmSelector />
      </div>
      
      {/* DIV SETTING */}
    </SleepStatusProvider>
  );
}

export default App;
