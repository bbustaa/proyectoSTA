import React, { useState, useEffect } from 'react';
import CanvasComponent from './CanvasComponent';
import io from 'socket.io-client';
import Lobby from './Lobby';

const socket = io('http://localhost:3000');

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
  const [historial, setHistorial] = useState([]); // Nuevo estado para el historial de dibujo
  const [isInGame, setIsInGame] = useState(false);
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [waitingForPlayers, setWaitingForPlayers] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(null);

  useEffect(() => {
    // Escuchar los datos de dibujo desde el servidor
    socket.on('actualizarDibujo', (data) => {
      setDibujo((prevDibujo) => [...prevDibujo, data]);
    });

    // Escuchar cuando se recibe el historial de dibujo desde el servidor
    socket.on('historialDibujo', (historialRecibido) => {
      setHistorial(historialRecibido);
    });

    // Escuchar cuando haya suficientes jugadores para empezar
    socket.on('readyToPlay', (firstPlayer) => {
      setWaitingForPlayers(false);
      setCurrentTurn(firstPlayer);
    });

    // Escuchar si estamos esperando jugadores
    socket.on('waitingForPlayers', () => {
      setWaitingForPlayers(true);
    });

    return () => {
      socket.off('actualizarDibujo');
      socket.off('historialDibujo');
      socket.off('readyToPlay');
      socket.off('waitingForPlayers');
    };
  }, []);

  // Función para manejar el envío de datos de dibujo al servidor
  const handleDibujo = (data) => {
    socket.emit('dibujar', { ...data, roomCode, username });
  };

  // Función para unirse a una partida existente
  const joinGame = (username, roomCode) => {
    setUsername(username);
    setRoomCode(roomCode);
    setIsInGame(true);
    socket.emit('joinRoom', roomCode, username);
  };

  // Función para crear una nueva partida
  const createGame = (username) => {
    const newRoomCode = generateRoomCode();
    setUsername(username);
    setRoomCode(newRoomCode);
    setIsInGame(true);
    socket.emit('joinRoom', newRoomCode, username);
  };

  return (
    <div>
      {isInGame ? (
        <div>
          <h1>Partida en Sala: {roomCode}</h1>
          {waitingForPlayers ? (
            <div>Esperando a más jugadores...</div>
          ) : (
            <div>
              <h2>Turno de: {currentTurn}</h2>
              <CanvasComponent 
                onDibujo={currentTurn === username ? handleDibujo : null}
                dibujosExternos={dibujo}
                historial={historial}  // Pasa el historial como prop
                username={username}  // Pasa el username actual 
              />
            </div>
          )}
        </div>
      ) : (
        <Lobby onJoinGame={joinGame} onCreateGame={createGame} />
      )}
    </div>
  );
}

export default App;
