import time
import threading

class Clock:
    def __init__(self, start_time="000000", speed=1.0):
        # Format: "hhmmss"
        self.lock = threading.Lock()
        self.running = False
        self._time = start_time
        self.speed = speed  # 1.0 = normal, 2.0 = 2x lebih cepat, dst

    def set_speed(self, speed):
        self.speed = speed

    def start(self):
        self.running = True
        threading.Thread(target=self._run, daemon=True).start()

    def _run(self):
        while self.running:
            with self.lock:
                h = int(self._time[0:2])
                m = int(self._time[2:4])
                s = int(self._time[4:6])
                s += 1
                if s >= 60:
                    s = 0
                    m += 1
                if m >= 60:
                    m = 0
                    h += 1
                if h >= 24:
                    h = 0
                self._time = f"{h:02d}{m:02d}{s:02d}"
            time.sleep(1.0 / self.speed)  # sleep dipercepat sesuai speed

    def get_time(self):
        with self.lock:
            return self._time

    def stop(self):
        self.running = False