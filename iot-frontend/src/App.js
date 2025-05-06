import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sensorData, setSensorData] = useState({});
  const [weather, setWeather] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials! Try admin/1234");
      setPassword("");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = new WebSocket("ws://localhost:8080");
    
    socket.onopen = () => {
      setConnectionStatus("connected");
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData(data);
      } catch (error) {
        console.error("Error parsing sensor data:", error);
      }
    };

    socket.onerror = (error) => {
      setConnectionStatus("error");
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      setConnectionStatus("disconnected");
      console.log("WebSocket disconnected");
    };

    const fetchWeather = async () => {
      try {
        const apiKey = "3c9de9654c4070bcb935113ea680d44f";
        const city = "Nanjing";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        setWeather({
          temp: data.main.temp,
          desc: data.weather[0].description,
          humidity: data.main.humidity,
          icon: data.weather[0].icon
        });
      } catch (error) {
        console.error("Weather fetch error:", error);
      }
    };

    fetchWeather();

    return () => {
      socket.close();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (sensorData.fire) {
      alert("🚨 FIRE DETECTED! Emergency protocols activated.");
    }
    if (sensorData.motion) {
      console.log("⚠️ Motion detected in the area");
    }
  }, [sensorData]);

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>IoT Dashboard Login</h2>
            <p>Enter your credentials to access the system</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">IoT Monitoring Platform</h1>
        <div className="connection-status">
          <span className={`status-indicator status-${connectionStatus}`}></span>
          {connectionStatus === "connected" ? "Connected" : "Disconnected"}
        </div>
      </header>

      <div className="dashboard-content">
        <section className="sensor-section">
          <h2 className="section-title">Real-time Sensor Data</h2>
          <div className="sensor-grid">
            <div className="sensor-card temperature-card">
              <h3>🌡️ Temperature</h3>
              <p>{sensorData.temp || "--"} <span className="unit">°C</span></p>
            </div>
            <div className="sensor-card humidity-card">
              <h3>💧 Humidity</h3>
              <p>{sensorData.humidity || "--"} <span className="unit">%</span></p>
            </div>
            <div className={`sensor-card ${sensorData.fire ? "alert" : "safety-card"}`}>
              <h3>🔥 Fire Status</h3>
              <p>{sensorData.fire ? "🚨 Detected" : "✅ Safe"}</p>
            </div>
            <div className={`sensor-card ${sensorData.motion ? "motion-card" : "still-card"}`}>
              <h3>🎯 Motion Detection</h3>
              <p>{sensorData.motion ? "⚠️ Detected" : "🔒 None"}</p>
            </div>
          </div>
        </section>

        <section className="weather-section">
          <h2 className="section-title">Current Weather</h2>
          {weather ? (
            <div className="weather-card">
              <div className="weather-main">
                {weather.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt="Weather icon"
                    className="weather-icon"
                  />
                )}
                <div className="weather-temp">
                  {weather.temp} <span className="unit">°C</span>
                </div>
              </div>
              <div className="weather-details">
                <p><strong>Condition:</strong> {weather.desc}</p>
                <p><strong>Humidity:</strong> {weather.humidity}%</p>
              </div>
            </div>
          ) : (
            <div className="loading-spinner"></div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;