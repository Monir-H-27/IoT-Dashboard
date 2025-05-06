#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// Replace with your network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// DHT Sensor settings
#define DHTPIN 4       // GPIO where DHT is connected
#define DHTTYPE DHT11  // DHT22 if you're using that
DHT dht(DHTPIN, DHTTYPE);

// Flame sensor on analog pin
const int flameSensorPin = 34;

void setup_wifi() {
  delay(100);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  pinMode(flameSensorPin, INPUT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int flameAnalogValue = analogRead(flameSensorPin);
  bool fire = flameAnalogValue < 300; // adjust based on your sensor

  // Construct JSON message
  String message = "{";
  message += "\"temp\":" + String(temperature, 1) + ",";
  message += "\"humidity\":" + String(humidity, 1) + ",";
  message += "\"fire\":" + String(fire ? "true" : "false");
  message += "}";

  // Publish to topic
  client.publish("iot/data", message.c_str());
  Serial.println("Published: " + message);

  delay(5000); // publish every 5 seconds
}
