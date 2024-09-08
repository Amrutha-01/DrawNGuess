const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const words = require("./app/components/words.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Store the users in each room and interval IDs for word sending
const usersInRooms = {};
const roomIntervals = {};

function getRandomWord(roomId) {
  const currentMinute = Math.floor(Date.now() / 60000); // Get the current time in minutes
  const seed = roomId + currentMinute; // Combine room ID with time to create a unique seed
  const randomIndex = seed % words.length; // Modulus to ensure the index is within bounds
  return words[randomIndex];
}

function sendRandomWordToRoom(roomId) {
  setInterval(() => {
    const word = getRandomWord(roomId);
    io.to(roomId).emit("receiveWord", word);
  }, 80000);
}

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (details) => {
    const { roomId, username } = details;
    socket.join(roomId); // Join the room
    console.log(`User ${username} (${socket.id}) joined room ${roomId}`);

    // Add the user to the room's user list
    if (!usersInRooms[roomId]) {
      usersInRooms[roomId] = [];
    }

    if (!usersInRooms[roomId].includes(username)) {
      usersInRooms[roomId].push(username);
    }

    // Emit the updated users list to the room
    io.to(roomId).emit("updateUsersInRoom", usersInRooms[roomId]);

    const word = getRandomWord(roomId);
    io.to(roomId).emit("receiveWord", word);

    // sendRandomWordToRoom(roomId);

    socket.on("startSendingWords", (roomId) => {
      sendRandomWordToRoom(roomId);
    });

    // Send the initial word

    // // Set up an interval to send a new word every 80 seconds if not already set
    // if (!roomIntervals[roomId]) {
    //   roomIntervals[roomId] = setInterval(() => {
    //     sendRandomWordToRoom(roomId);
    //   }, 80000);
    // }

    // Clean up when the user disconnects
    socket.on("disconnect", () => {
      console.log(`User ${username} (${socket.id}) left room ${roomId}`);

      // Remove the user from the room's user list
      if (usersInRooms[roomId]) {
        const index = usersInRooms[roomId]?.indexOf(username);
        if (index !== -1) {
          usersInRooms[roomId].splice(index, 1);
          // Emit the updated users list to the room
          io.to(roomId).emit("updateUsersInRoom", usersInRooms[roomId]);
        }
      }

      // If the room is empty, clear the interval and delete the room data
      if (usersInRooms[roomId] && usersInRooms[roomId].length === 0) {
        clearInterval(roomIntervals[roomId]);
        delete roomIntervals[roomId];
        delete usersInRooms[roomId];
      }

      console.log("Client disconnected");
    });
  });

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });
});

server.listen(8001, () => console.log("Socket.IO server running on port 8001"));
