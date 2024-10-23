const io = require('socket.io')(3000, {
    cors: {
      origin: "http://localhost:5173",  // El puerto donde corre tu aplicación React con Vite
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Jugador conectado', socket.id);
  
    // Recibir datos de dibujo y retransmitir a todos los demás jugadores
    socket.on('dibujar', (data) => {
      socket.broadcast.emit('actualizarDibujo', data);
    });
  
    socket.on('disconnect', () => {
      console.log('Jugador desconectado', socket.id);
    });
  });
  
  console.log('Servidor de Websockets iniciado en el puerto 3000');
  