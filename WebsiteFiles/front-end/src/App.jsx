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
    { title: "Based on time", description: "Alarm mechanism will start based on time to wakeup." },
    { title: "Based on algorithm", description: "Algorithm will activate alarm mechanism when its time to wakeup. (Hardware required)" },
    { title: "Ring immediately", description: "Wake up instantly with main alarm sound sound" },
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
      <p className="text-2xl font-bold text-white">Alarm type</p>
      <p className="text-gray-400 mb-4">Choose the alarm type that you feel comfortable with. This will determine how you wake up.</p>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-custom"
        style={{ scrollSnapType: "x mandatory" }}
      >
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

const SoundSetting = ({ title }) => {
  const [volume, setVolume] = useState(25);

  return (
    <div className="mb-3">
      <p className="text-white font-medium">{title}</p>
      <div className="flex items-center space-x-2">
        <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        <span className="text-gray-300 w-10 text-right">{volume}%</span>
      </div>
      <input type="text" placeholder="Link suara" className="w-full mt-2 p-2 rounded-md bg-[#353535] text-white placeholder-gray-400" />
    </div>
  );
};

function AlarmSettings() {
  return (
    <div>
      <div className="bg-[#2b2b2b] md:bg-[#2b2b2b]/0 px-8 md:px-58 py-1 pb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
        <p className="text-gray-400">All of the alarm and clock settings should be here.</p>
      </div>
      <div className="px-8 md:px-58">
        <p className="">Set your main time:</p>
        <input
          type="time"
          className="mt-2 p-2 w-full rounded-md bg-[#353535] text-white placeholder-gray-400"
          onChange={(e) => {
            // use GET request
            fetch(`http://localhost:8000/set-clock?time=${e.target.value.replace(":", "")}00`).catch((err) => console.error("Error setting clock:", err));
          }}
        />
        <p className="mt-6">Set your time speed:</p>
        <ClockSpeedControl />
      </div>

      <div className="px-8 md:px-58 py-6">
        <p>Configure your alarm sound.</p>
        <SoundSetting title="Primary alarm" />
        <SoundSetting title="Sound one" />
        <SoundSetting title="Sound two" />
        <SoundSetting title="Sound three" />
      </div>
    </div>
  );
}

function ClockSpeedControl() {
  const [speed, setSpeed] = useState(1);

  // Slider range: 0.1x - 5x
  const handleChange = (e) => setSpeed(Number(e.target.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/set-clock-speed?speed=" + speed, {
      method: "POST",
    });
  };

  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        await handleSubmit(e);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 1500);
      }}
      className="flex items-center space-x-3"
    >
      <input
        type="range"
        min="1"
        max="20"
        step="0.1"
        value={speed}
        onChange={handleChange}
        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <span className="text-gray-300 w-16 text-right">{speed.toFixed(1)}x</span>
      <button
        type="submit"
        className={`ml-2 px-3 py-1 rounded bg-[#353535] transition-colors duration-200 ${
          submitted ? "bg-blue-400 text-white" : ""
        }`}
      >
        {submitted ? "Done" : "Set"}
      </button>
    </form>
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
      <AlarmSettings />
    </SleepStatusProvider>
  );
}

export default App;
