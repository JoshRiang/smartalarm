# this file is used to accept data from the C client and write it to a CSV file
import socket
import threading
import csv
from datetime import datetime
import os

csv_filename = "position_data.csv"

# Buat file dan header jika belum ada
if not os.path.exists(csv_filename):
    with open(csv_filename, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["timestamp", "x", "y", "z"])

def listener_thread(conn):
    while True:
        try:
            data = conn.recv(1024)
            if not data:
                break
            lines = data.decode().strip().split("\n")
            with open(csv_filename, "a", newline="") as csvfile:
                writer = csv.writer(csvfile)
                for line in lines:
                    parts = line.strip().split(",")
                    if len(parts) == 4:
                        writer.writerow(parts)
                        print(f"Data ditulis: {parts}")
        except:
            break
    conn.close()

def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(("0.0.0.0", 12345))
    s.listen(1)
    print("Menunggu koneksi dari C Client...")

    conn, addr = s.accept()
    print(f"Tersambung dari {addr}")

    threading.Thread(target=listener_thread, args=(conn,), daemon=True).start()

    while True:
        pass  # Biarkan berjalan terus

if __name__ == "__main__":
    main()
