const socket = io();
const roomList = document.getElementById('room-list');
const createRoomButton = document.getElementById('create-room-btn');
const roomInput = document.getElementById('room-name');

fetch('/rooms')
  .then((response) => response.json())
  .then((rooms) => {
    updateRoomList(rooms);
  });

createRoomButton.addEventListener('click', () => {
  const roomName = roomInput.value.trim();
  if (roomName) {
    socket.emit('create-room', roomName);
    roomInput.value = '';
  }
});

socket.on('rooms-updated', (rooms) => {
  updateRoomList(rooms);
});

function joinRoom(roomName) {
  if (roomName) {
    window.open(`/chat.html?room=${roomName}`, '_blank');
  }
}

function updateRoomList(rooms) {
  roomList.innerHTML = '';

  if (rooms.length > 0) {
    const boxContainer = document.createElement('div');
    boxContainer.className = 'room-box-container';

    rooms.forEach((room) => {
      const roomElement = document.createElement('div');
      roomElement.className = 'room-item';
      roomElement.textContent = room;
      roomElement.onclick = () => joinRoom(room);
      boxContainer.appendChild(roomElement);
    });

    roomList.appendChild(boxContainer);
  } else {
    const noRoomsMessage = document.createElement('p');
    noRoomsMessage.textContent = 'No rooms available. Create a new room to start chatting!';
    noRoomsMessage.style.color = '#e0e0e0';
    roomList.appendChild(noRoomsMessage);
  }
}
