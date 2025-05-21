// SleepStatusContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const SleepStatusContext = createContext(null);

const SLEEPING_STATUS_URL = "http://127.0.0.1:8000/get-sleeping-status";
const CHECK_INTERVAL = 5; // 5 menit

export const SleepStatusProvider = ({ children }) => {
  const [isSleeping, setIsSleeping] = useState(null);

  useEffect(() => {
    const fetchSleepStatus = async () => {
      try {
        const response = await fetch(SLEEPING_STATUS_URL);
        const data = await response.json();
        // console.log("Fetched sleep status:", data);
        setIsSleeping(data.status);

      } catch (error) {
        console.error("Error fetching sleep status:", error);
      }
    };

    fetchSleepStatus(); // Fetch immediately on mount
    const intervalId = setInterval(fetchSleepStatus, CHECK_INTERVAL * 1000); // Set interval

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return <SleepStatusContext.Provider value={{ isSleeping }}>{children}</SleepStatusContext.Provider>;
};
