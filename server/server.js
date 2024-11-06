const io = require('socket.io')(3000, {
  cors: {
    origin: "http://localhost:5173", // Cambia según tu configuración de frontend
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Jugador conectado', socket.id);

  // Unirse a una sala específica
  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);
    console.log(`Jugador ${socket.id} se unió a la sala ${roomCode}`);
  });

  // Enviar los datos de dibujo solo a la sala correspondiente
  socket.on('dibujar', (data) => {
    const { roomCode, x, y, color, lineWidth } = data;
    socket.to(roomCode).emit('actualizarDibujo', { x, y, color, lineWidth });
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado', socket.id);
  });
});

console.log('Servidor de Websockets iniciado en el puerto 3000');
