import serial
import time

# Ganti dengan port ESP32 Anda, contoh: "COM3" (Windows) atau "/dev/ttyUSB0" (Linux)
esp32_port = "COM5"
baud_rate = 115200

# Buka koneksi serial
ser = serial.Serial(esp32_port, baud_rate, timeout=1)
time.sleep(2)  # Tunggu ESP32 reset

for _ in range(8): 
    ser.readline()  

# make while loop for press 1 to send command
while True: 
    response = ser.readline().decode('utf-8', errors='ignore').strip()
    print(f"ESP32: {response}")
    # command = input("Press 1 to send command: ")
    # if command == "1":
    #     ser.write(b"say_hello\n")  # Kirim perintah
    # else: 
    #     break
    
    
# Tutup koneksi
ser.close()
