import React, { useRef, useState, useEffect } from 'react';

const CanvasComponent = ({ onDibujo, dibujosExternos }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(5);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Iniciar el dibujo
  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    lastPosition.current = { x: offsetX, y: offsetY };
  };

  // Dibujar mientras el mouse se mueve
  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    // Enviar datos de dibujo al padre
    if (onDibujo) {
      onDibujo({ x: offsetX, y: offsetY, color, lineWidth });
    }
    lastPosition.current = { x: offsetX, y: offsetY };
  };

  // Finalizar el dibujo
  const finishDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
  };

  // Función para limpiar el canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpia el canvas
  };

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

    dibujosExternos.forEach((data, index) => {
      const { x, y, color, lineWidth } = data;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (index === 0 || data.newPath) {
        // Mover a la posición inicial si es el primer punto o un nuevo trazo
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        // Conectar con el último punto
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      lastPosition.current = { x, y };
    });
  }, [dibujosExternos]); // Vuelve a ejecutar el efecto cuando dibujosExternos cambie

  return (
    <div>
      {/* Selección de colores */}
      <div>
        <button onClick={() => setColor('black')}>Negro</button>
        <button onClick={() => setColor('red')}>Rojo</button>
        <button onClick={() => setColor('blue')}>Azul</button>
        <button onClick={() => setColor('green')}>Verde</button>
        <button onClick={() => setColor('yellow')}>Amarillo</button>
        <button onClick={() => setColor('purple')}>Morado</button>
        <button onClick={() => setColor('white')}>Goma de borrar</button>
      </div>

      {/* Selección del grosor */}
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

      {/* Botón para limpiar la pizarra */}
      <div>
        <button onClick={clearCanvas}>Limpiar Pizarra</button>
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
          backgroundColor: 'white',  // Fondo blanco para la pizarra
          border: '1px solid black'   // Borde visible
        }}
      />
    </div>
  );
};

export default CanvasComponent;
