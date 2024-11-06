import React, { useState, useEffect } from 'react';
import CanvasComponent from './CanvasComponent';
import io from 'socket.io-client';
import Lobby from './Lobby';

const socket = io('http://localhost:3000');

// Función para generar un código de sala sencillo
function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

function App() {
  const [dibujo, setDibujo] = useState([]);
  const [isInGame, setIsInGame] = useState(false);
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    // Escuchar los datos de dibujo desde el servidor
    socket.on('actualizarDibujo', (data) => {
      setDibujo((prevDibujo) => [...prevDibujo, data]);
    });
  }, []);

  // Función para manejar el envío de datos de dibujo al servidor
  const handleDibujo = (data) => {
    socket.emit('dibujar', { ...data, roomCode });
  };

  // Función para unirse a una partida existente
  const joinGame = (username, roomCode) => {
    setUsername(username);
    setRoomCode(roomCode);
    setIsInGame(true);
    socket.emit('joinRoom', roomCode);
  };

  // Función para crear una nueva partida
  const createGame = (username) => {
    const newRoomCode = generateRoomCode();  // Genera un código de sala sencillo
    setUsername(username);
    setRoomCode(newRoomCode);
    setIsInGame(true);
    socket.emit('joinRoom', newRoomCode);
  };

  return (
    <div>
      {isInGame ? (
        <div>
          <h1>Partida en Sala: {roomCode}</h1>
          <CanvasComponent onDibujo={handleDibujo} />
        </div>
      ) : (
        <Lobby onJoinGame={joinGame} onCreateGame={createGame} />
      )}
    </div>
  );
}

export default App;
