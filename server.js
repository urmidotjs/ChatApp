const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = [];

app.use(express.static('public'));

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create-room', (roomName) => {
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
      io.emit('rooms-updated', rooms);
    }
  });

  socket.on('join-room', ({ roomName, username }) => {
    socket.join(roomName);
    console.log(`${username} (${socket.id}) joined room: ${roomName}`);
    io.to(roomName).emit('chat-message', {
      username: 'System',
      message: `${username} has joined the room.`,
    });
  });

  socket.on('send-message', ({ roomName, message, username }) => {
    io.to(roomName).emit('chat-message', { username, message });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
