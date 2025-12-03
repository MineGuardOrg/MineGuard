#include <Wire.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

#include <MAX30105.h>
#include "spo2_algorithm.h"
#include <heartRate.h>

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// ==========================
// OBJETOS DE SENSORES
// ==========================
MAX30105 sensor;
Adafruit_MPU6050 mpu;

// ==========================
// MQ7
// ==========================
int MQ7_PIN = 34;

// ==========================
// WIFI
// ==========================
const char* ssid = "iPhone";
const char* password = "ness032210";

// ==========================
// TOKEN y BACKEND
// ==========================
const char* TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IkFkbWluIiwibmFtZSI6IkFsZXhhbmRlciIsImxhc3RfbmFtZSI6IlBhcnJhIiwiZXhwIjoxNzY0ODcyOTE1fQ.sNeL21J1z0ZPM461u0XuYQP0_zbShIJNAuPthVrcl4U";
const char* API_URL = "https://mineguard-api-staging-fxhyfyanhacjf7g5.mexicocentral-01.azurewebsites.net/readings/";

// ==========================
// MAX30102
// ==========================
#define BUFFER_SIZE 100
uint32_t irBuffer[BUFFER_SIZE];
uint32_t redBuffer[BUFFER_SIZE];

// ==========================
// PROMEDIO MOVIL
// ==========================
#define BPM_HISTORY 5
float bpmHistory[BPM_HISTORY] = {85,85,85,85,85};
int bpmIndex = 0;

#define TEMP_HISTORY 5
float tempHistory[TEMP_HISTORY] = {36.5,36.5,36.5,36.5,36.5};
int tempIndex = 0;

int final_mq7_ppm = 0;

// ==========================
// FUNCIONES DE FILTRADO
// ==========================
int filtrarMQ7(int raw) {
  float voltage = (raw / 4095.0) * 5.0;
  int ppm = voltage * 100;
  if (ppm < 0) ppm = 0;
  return ppm;
}

int filtrarBPM(int bpm_sensor, int valid) {
  if (valid == 1 && bpm_sensor >= 50 && bpm_sensor <= 120) {
    bpmHistory[bpmIndex] = bpm_sensor;
  } 
  bpmIndex = (bpmIndex + 1) % BPM_HISTORY;

  float sum = 0;
  for (int i=0;i<BPM_HISTORY;i++) sum += bpmHistory[i];
  return round(sum / BPM_HISTORY);
}

float filtrarTemp(float temp) {
  if (temp < 30 || temp > 40) temp = 36.5;
  tempHistory[tempIndex] = temp;
  tempIndex = (tempIndex + 1) % TEMP_HISTORY;

  float sum = 0;
  for (int i=0;i<TEMP_HISTORY;i++) sum += tempHistory[i];
  return sum / TEMP_HISTORY;
}

float filtrarRuido(float valor, float umbral) {
  if (abs(valor) < umbral) return 0.0;
  return valor;
}

// ==========================
// RECONEXION WIFI
// ==========================
void conectarWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  WiFi.disconnect();
  WiFi.begin(ssid, password);
  Serial.print("Conectando WiFi");
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 30) {
    delay(500);
    Serial.print(".");
    intentos++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado!");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nNo se pudo conectar WiFi");
  }
}

// ==========================
// SETUP
// ==========================
void setup() {
  Serial.begin(115200);
  delay(500);

  conectarWiFi();

  // MAX30102
  if (!sensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("Fallo MAX30102");
    while (1);
  }
  sensor.setup();
  sensor.setPulseAmplitudeRed(0x7F);
  sensor.setPulseAmplitudeIR(0x7F);

  // MPU6050
  if (!mpu.begin()) {
    Serial.println("MPU6050 error");
    while (1);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
}

// ==========================
// LOOP
// ==========================
void loop() {

  conectarWiFi();

  // ============================
  // MAX30102
  // ============================
  for (int i = 0; i < BUFFER_SIZE; i++) {
    while (!sensor.available()) sensor.check();
    redBuffer[i] = sensor.getRed();
    irBuffer[i] = sensor.getIR();
    sensor.nextSample();
  }

  int32_t spo2 = 0, bpm_raw = 0;
  int8_t spo2Valid = 0, bpmValid = 0;

  maxim_heart_rate_and_oxygen_saturation(
    irBuffer, BUFFER_SIZE,
    redBuffer,
    &spo2, &spo2Valid,
    &bpm_raw, &bpmValid
  );

  int final_bpm = filtrarBPM(bpm_raw, bpmValid);

  // ============================
  // MQ7
  // ============================
  int mq7_raw = analogRead(MQ7_PIN);
  final_mq7_ppm = filtrarMQ7(mq7_raw);

  // ============================
  // MPU6050
  // ============================
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float ax = filtrarRuido(a.acceleration.x, 0.05);
  float ay = filtrarRuido(a.acceleration.y, 0.05);
  float az = filtrarRuido(a.acceleration.z, 0.05);

  float gx = filtrarRuido(g.gyro.x, 0.1);
  float gy = filtrarRuido(g.gyro.y, 0.1);
  float gz = filtrarRuido(g.gyro.z, 0.1);

  float body_temp = filtrarTemp(temp.temperature);

  // ============================
  // JSON
  // ============================
  String json = "{";
  json += "\"user_id\":1,";
  json += "\"device_id\":1,";
  json += "\"mq7\":" + String(final_mq7_ppm) + ",";
  json += "\"pulse\":" + String(final_bpm) + ",";
  json += "\"body_temp\":" + String(body_temp,2) + ",";
  json += "\"ax\":" + String(ax) + ",";
  json += "\"ay\":" + String(ay) + ",";
  json += "\"az\":" + String(az) + ",";
  json += "\"gx\":" + String(gx) + ",";
  json += "\"gy\":" + String(gy) + ",";
  json += "\"gz\":" + String(gz);
  json += "}";

  Serial.println(json);

  // ============================
  // ENVIO HTTPS
  // ============================
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
  http.begin(client, API_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + TOKEN);
  http.setTimeout(5000);

  int code = http.POST(json);

  if (code > 0) {
    Serial.println("HTTP enviado: " + String(code));
    Serial.println(http.getString());
  } else {
    Serial.println("Error HTTP: " + String(code));
  }

  http.end();
  client.stop();

  delay(2500); // Espera para siguiente lectura
}
