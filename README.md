# 🌐 IoT Smart Dashboard Platform (with ESP32, MQTT, Node.js & React)

This project is a complete **IoT platform** integrating real-time sensor data from **ESP32 hardware** with a **web-based dashboard**. It includes:

- 🔌 **ESP32 firmware** that reads temperature, humidity, and fire detection sensors, and publishes data using **MQTT**
- 🧠 **Node.js MQTT backend** to receive sensor data and forward it via WebSocket
- 📊 **React frontend dashboard** that displays real-time weather data, forecasts, sensor readings, and advanced alarm notifications

---

## 🚀 Features

- 🌤️ Live **weather forecast** using OpenWeatherMap API  
- 🌡️ **Sensor readings**: temperature, humidity, fire detection  
- 🔥 **Advanced alarm system** for fire and temperature threshold alerts  
- 🧭 Real-time **ESP32-MQTT communication**  
- 🔐 **Login system** (future extensible)  
- 💬 **WebSocket integration** for real-time updates  

---

## 📦 Tech Stack

- **ESP32** (C++, Arduino)
- **MQTT** (broker: `broker.hivemq.com`)
- **Node.js + WebSocket** (backend)
- **React.js** (frontend)
- **OpenWeatherMap API** for live weather

---

## 🔧 How to Use

1. Flash ESP32 with the provided Arduino code  
2. Run the backend (`iot-backend/`) using Node.js  
3. Start the React frontend (`iot-frontend/`)  
4. Monitor real-time sensor data and weather via the dashboard  

---

## 📂 Project Structure

```
iot-full-project/
├── iot-backend/        # Node.js backend (MQTT + WebSocket)
├── iot-frontend/       # React.js dashboard
└── esp32-code/         # Arduino ESP32 code
```

---

## 🤖 Hardware Used

- ESP32 Dev Board  
- DHT11 or DHT22 (Temperature & Humidity)  
- Flame sensor (analog)  
- (Optional) PIR Motion sensor  


