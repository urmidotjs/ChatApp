const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = []; // Array to store room names

// Serve static files
app.use(express.static('public'));

// API to get the list of rooms
app.get('/rooms', (req, res) => {
  res.json(rooms);
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle room creation
  socket.on('create-room', (roomName) => {
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
      io.emit('rooms-updated', rooms); // Notify all clients about the updated room list
    }
  });

  // Handle joining a room
  socket.on('join-room', ({ roomName, username }) => {
    socket.join(roomName);
    console.log(`${username} (${socket.id}) joined room: ${roomName}`);
    io.to(roomName).emit('chat-message', {
      username: 'System',
      message: `${username} has joined the room.`,
    });
  });

  // Handle chat messages
  socket.on('send-message', ({ roomName, message, username }) => {
    io.to(roomName).emit('chat-message', { username, message });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});