const io = require('socket.io')(3000, {
  cors: {
    origin: "http://localhost:5173", // Cambia según tu configuración de frontend
    methods: ["GET", "POST"]
  }
});

const rooms = {};  // Estructura para almacenar jugadores y turnos por sala

io.on('connection', (socket) => {
  console.log('Jugador conectado', socket.id);

  // Unirse a una sala específica
  socket.on('joinRoom', (roomCode, username) => {
    socket.join(roomCode);
    
    // Inicializar la sala si no existe
    if (!rooms[roomCode]) {
      rooms[roomCode] = { players: [], turn: 0 };
    }

    // Añadir el jugador a la sala
    rooms[roomCode].players.push({ id: socket.id, username });
    console.log(`Jugador ${username} se unió a la sala ${roomCode}`);

    // Enviar el historial de dibujo al nuevo usuario si hay datos almacenados
    if (rooms[roomCode].players.length >= 2) {
      // Notificar a los jugadores en la sala que pueden empezar a jugar
      io.to(roomCode).emit('readyToPlay', rooms[roomCode].players[rooms[roomCode].turn].username);
    } else {
      socket.emit('waitingForPlayers');
    }
  });

  // Enviar los datos de dibujo solo a la sala correspondiente y gestionar turnos
  socket.on('dibujar', (data) => {
    const { roomCode, x, y, color, lineWidth, newPath, username } = data;

    // Validar que sea el turno del jugador que está dibujando
    const currentTurnPlayer = rooms[roomCode].players[rooms[roomCode].turn];
    if (currentTurnPlayer && currentTurnPlayer.username === username) {
      socket.to(roomCode).emit('actualizarDibujo', { x, y, color, lineWidth, newPath });

      // Al finalizar el turno, pasar al siguiente jugador
      // rooms[roomCode].turn = (rooms[roomCode].turn + 1) % rooms[roomCode].players.length;
      // const nextPlayer = rooms[roomCode].players[rooms[roomCode].turn].username;
      // io.to(roomCode).emit('nextTurn', nextPlayer);
    }
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado', socket.id);
  });
});

console.log('Servidor de Websockets iniciado en el puerto 3000');