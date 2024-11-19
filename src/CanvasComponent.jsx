import React, { useRef, useState, useEffect } from 'react';

const CanvasComponent = ({ onDibujo, dibujosExternos, username, historial }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(5);

  // Iniciar el dibujo
  const startDrawing = (e) => {
    if (!onDibujo) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    if (onDibujo) {
      onDibujo({ x: offsetX, y: offsetY, color, lineWidth, newPath: true, username });
    }
  };

  // Dibujar mientras el mouse se mueve
  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    if (onDibujo) {
      onDibujo({ x: offsetX, y: offsetY, color, lineWidth, newPath: false, username });
    }
  };

  // Finalizar el dibujo
  const finishDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
  };

  // Función para limpiar el canvas localmente
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Dibujar el historial cada vez que cambie
  useEffect(() => {
    if (historial && historial.length > 0) {
      drawHistorial(historial);
    } else {
      clearCanvas();
    }
  }, [historial]);

  // Función para dibujar el historial recibido
  const drawHistorial = (historial) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    historial.forEach((data) => {
      const { x, y, color, lineWidth, newPath } = data;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (newPath) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });
  };

  // Configurar el contexto del canvas al cambiar el color o el grosor
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
  }, [color, lineWidth]);

  // Efecto para dibujar datos recibidos de otros usuarios
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    dibujosExternos.forEach((data) => {
      const { x, y, color, lineWidth, newPath } = data;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (newPath) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });
  }, [dibujosExternos]);

  return (
    <div>
      <div>
        <button onClick={() => setColor('black')}>Negro</button>
        <button onClick={() => setColor('red')}>Rojo</button>
        <button onClick={() => setColor('blue')}>Azul</button>
        <button onClick={() => setColor('green')}>Verde</button>
        <button onClick={() => setColor('yellow')}>Amarillo</button>
        <button onClick={() => setColor('purple')}>Morado</button>
        <button onClick={() => setColor('white')}>Goma de borrar</button>
      </div>

      <div>
        <label>Grosor: </label>
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
      </div>

      <div>
        <button onClick={() => onDibujo && onDibujo({ limpiar: true })}>Limpiar Pizarra</button>
      </div>

      <canvas
        ref={canvasRef}
        width="800"
        height="600"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        style={{
          backgroundColor: 'white',
          border: '1px solid black'
        }}
      />
    </div>
  );
};

export default CanvasComponent;
