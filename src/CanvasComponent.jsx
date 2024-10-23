import React, { useRef, useState, useEffect } from 'react';

const CanvasComponent = ({ onDibujo }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Iniciar el dibujo
  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
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
      onDibujo({ x: offsetX, y: offsetY });
    }
  };

  // Finalizar el dibujo
  const finishDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;  // Grosor de la línea
    ctx.lineCap = 'round';  // Estilo de la línea (redondeada)
    ctx.strokeStyle = 'red';  // Color de la línea
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="600"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
      style={{ border: '1px solid black' }}
    />
  );
};

export default CanvasComponent;
