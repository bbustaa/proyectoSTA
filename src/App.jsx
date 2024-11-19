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
  const [historial, setHistorial] = useState([]);
  const [isInGame, setIsInGame] = useState(false);
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [waitingForPlayers, setWaitingForPlayers] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(null);

  useEffect(() => {
    socket.on('actualizarDibujo', (data) => {
      setDibujo((prevDibujo) => [...prevDibujo, data]);
    });

    socket.on('historialDibujo', (historialRecibido) => {
      setHistorial(historialRecibido);
      setDibujo(historialRecibido);
    });

    socket.on('readyToPlay', (firstPlayer) => {
      setWaitingForPlayers(false);
      setCurrentTurn(firstPlayer);
    });

    socket.on('waitingForPlayers', () => {
      setWaitingForPlayers(true);
    });

    socket.on('limpiarPizarra', () => {
      setHistorial([]);
      setDibujo([]);
    });

    return () => {
      socket.off('actualizarDibujo');
      socket.off('historialDibujo');
      socket.off('readyToPlay');
      socket.off('waitingForPlayers');
      socket.off('limpiarPizarra');
    };
  }, []);

  const handleDibujo = (data) => {
    if (data.limpiar) {
      socket.emit('limpiarPizarra', { roomCode });
    } else {
      socket.emit('dibujar', { ...data, roomCode, username });
    }
  };

  const joinGame = (username, roomCode) => {
    setUsername(username);
    setRoomCode(roomCode);
    setIsInGame(true);
    socket.emit('joinRoom', roomCode, username);
  };

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
                historial={historial}
                username={username}
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
