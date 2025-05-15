void setup() {
  Serial.begin(115200);
  while (!Serial) {
    ; // tunggu koneksi serial
  }
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');  // Baca hingga newline
    if (input == "say_hello") {
      Serial.println("Hello from ESP32!");
    } else {
      Serial.println("Unknown command: " + input);
    }
  }
}
