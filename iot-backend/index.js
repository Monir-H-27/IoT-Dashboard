
const mqtt = require("mqtt");
const WebSocket = require("ws");

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server started at ws://localhost:8080");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT Broker");
  mqttClient.subscribe("iot/data");
});

mqttClient.on("message", (topic, message) => {
  const data = message.toString();
  console.log("Received:", data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});
