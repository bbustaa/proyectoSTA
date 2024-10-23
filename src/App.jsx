import React, { useState, useEffect } from 'react';
import CanvasComponent from './CanvasComponent';  // Asegúrate de que el path es correcto
import io from 'socket.io-client';

const socket = io('http://localhost:3000');  // Conecta al servidor de Websockets

function App() {
  const [dibujo, setDibujo] = useState([]);

  useEffect(() => {
    // Escuchar los datos de dibujo desde el servidor
    socket.on('actualizarDibujo', (data) => {
      setDibujo((prevDibujo) => [...prevDibujo, data]);
    });
  }, []);

  const handleDibujo = (data) => {
    // Enviar los datos de dibujo al servidor
    socket.emit('dibujar', data);
  };

  return (
    <div>
      <h1>Pictionary con Websockets</h1>
      <CanvasComponent onDibujo={handleDibujo} />
    </div>
  );
}

export default App;
