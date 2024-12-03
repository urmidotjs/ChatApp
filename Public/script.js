const socket = io();
const roomList = document.getElementById('room-list'); // Ensure ID matches HTML
const createRoomButton = document.getElementById('create-room-btn');
const roomInput = document.getElementById('room-name');

// Fetch available rooms on page load
fetch('/rooms')
  .then((response) => response.json())
  .then((rooms) => {
    updateRoomList(rooms);
  });

// Create a new room
createRoomButton.addEventListener('click', () => {
  const roomName = roomInput.value.trim();
  if (roomName) {
    socket.emit('create-room', roomName);
    roomInput.value = ''; // Clear input field
  }
});

// Update room list when notified by the server
socket.on('rooms-updated', (rooms) => {
  updateRoomList(rooms);
});

// Join a room
function joinRoom(roomName) {
  if (roomName) {
    window.open(`/chat.html?room=${roomName}`, '_blank'); // Open chat in a new tab
  }
}

// Update room list UI
function updateRoomList(rooms) {
  roomList.innerHTML = '';
  rooms.forEach((room) => {
    const roomElement = document.createElement('div');
    roomElement.className = 'room-item';
    roomElement.textContent = room;
    roomElement.onclick = () => joinRoom(room);
    roomList.appendChild(roomElement);
  });
}