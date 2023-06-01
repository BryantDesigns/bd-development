// Importing required modules
const express = require("express");
const server = require("http").createServer();
const app = express();

// Route handler for the root URL
app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

// Attaching the Express app to the server
server.on("request", app);

// Starting the server on port 3000
server.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});

/** Begin Websockets */
// Importing WebSockets module
const WebSocketsServer = require("ws").Server;

// Creating a WebSocket server and attaching it to the existing server
const wss = new WebSocketsServer({ server: server });

// Handling new client connections
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  // Getting the number of currently connected clients
  const numClients = wss.clients.size;
  console.log("Number of clients connected: " + numClients);

  // Broadcasting the number of clients to all connected clients
  wss.broadcast(`Current visitors: ${numClients}`);

  // Sending a welcome message to the newly connected client
  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server!");
  }

  // Handling client disconnection
  ws.on("close", function close() {
    // Broadcasting the updated number of clients to all connected clients
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log("Client disconnected");
  });
});

// Broadcasts a message to all connected clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
