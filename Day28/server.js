const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

// app attached with server , as we know app is simply a route handler
const server = http.createServer(app);
// io is attached with the same server so that the server can accept websocket data and send it to io to handle it as we know http request is handle by server through 'app' , so here io will accept the websocket request.
const io = new Server(server);

// after creating server and attaching app + io we will start listening the server as we did it in the db case.
server.listen(process.env.PORT, () => {
  console.log("Server Listening at Port");
});

// io has started the connection and accepting req from client through (socket) here socket is simply same as request used in (app) the route handler.

io.on("connection", (socket) => {
  // join-room yahan

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // send-message yahan

  socket.on("send-message", ({ user, text, roomId }) => {
    io.to(roomId).emit("new-message", { user, text });
  });

  // disconnect yahan
});
