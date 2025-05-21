from clock import Clock
import time

# Input waktu awal dari user
start_time = input("Masukkan waktu awal (hhmmss): ")

# Buat dan jalankan clock
clock = Clock(start_time)
clock.start()

# Contoh: akses setiap detik
try:
    while True:
        print(clock.get_time())
        time.sleep(1)
except KeyboardInterrupt:
    clock.stop()
    print("\nClock dihentikan.")
