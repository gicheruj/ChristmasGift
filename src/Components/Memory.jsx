import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

const MemoryPuzzle = ({ onContinue }) => {
  const [gameState, setGameState] = useState('start'); // start, playing, complete
  const [pieces, setPieces] = useState([]);
  const [placedPieces, setPlacedPieces] = useState(new Set());
  const [messages, setMessages] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // REPLACE THIS URL WITH YOUR OWN IMAGE URL
 const MEMORY_IMAGE_URL = "/CouplePic.jpg";

  const GRID_SIZE = 3; // 3x3 = 9 pieces
  const PIECE_SIZE = 120;
  const SNAP_THRESHOLD = 40;

  const pieceMessages = [
    "This moment meant a lot to me.",
  ];

  useEffect(() => {
    // Load the image when component mounts
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
    };
    img.src = MEMORY_IMAGE_URL;
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && pieces.length === 0 && imageRef.current) {
      initializePuzzle();
    }
  }, [gameState]);

  const initializePuzzle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (img && img.complete) {
      // Draw the memory image
      const scale = Math.min(
        (PIECE_SIZE * GRID_SIZE) / img.width,
        (PIECE_SIZE * GRID_SIZE) / img.height
      );
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = ((PIECE_SIZE * GRID_SIZE) - scaledWidth) / 2;
      const offsetY = ((PIECE_SIZE * GRID_SIZE) - scaledHeight) / 2;
      
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, PIECE_SIZE * GRID_SIZE, PIECE_SIZE * GRID_SIZE);
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    } else {
      // Fallback gradient if image hasn't loaded
      const gradient = ctx.createLinearGradient(0, 0, PIECE_SIZE * GRID_SIZE, PIECE_SIZE * GRID_SIZE);
      gradient.addColorStop(0, '#ffd7e5');
      gradient.addColorStop(0.5, '#c7b8ea');
      gradient.addColorStop(1, '#a8d5e2');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, PIECE_SIZE * GRID_SIZE, PIECE_SIZE * GRID_SIZE);
      
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText('♡', 150, 180);
      ctx.font = 'bold 32px Arial';
      ctx.fillText('✨', 80, 100);
      ctx.fillText('✨', 260, 280);
    }

    // Initialize pieces with MORE SCRAMBLING
    const newPieces = [];
    const containerWidth = PIECE_SIZE * GRID_SIZE;
    const containerHeight = PIECE_SIZE * GRID_SIZE;
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const correctX = col * PIECE_SIZE;
        const correctY = row * PIECE_SIZE;
        
        // Much more scattered - pieces can be anywhere in the container
        const offsetX = (Math.random() - 0.5) * containerWidth * 0.6;
        const offsetY = (Math.random() - 0.5) * containerHeight * 0.6;
        
        newPieces.push({
          id: row * GRID_SIZE + col,
          row,
          col,
          correctX,
          correctY,
          currentX: correctX + offsetX,
          currentY: correctY + offsetY,
          placed: false
        });
      }
    }
    setPieces(newPieces);
  };

  const handleMouseDown = (e, piece) => {
    if (piece.placed) return;
    e.preventDefault();
    
    const container = document.getElementById('puzzle-container');
    const rect = container.getBoundingClientRect();
    const pieceRect = e.currentTarget.getBoundingClientRect();
    
    const offsetX = e.clientX - pieceRect.left;
    const offsetY = e.clientY - pieceRect.top;
    
    setDraggedPiece({ ...piece, offsetX, offsetY });
  };

  const handleMouseMove = (e) => {
    if (!draggedPiece) return;
    e.preventDefault();
    
    const container = document.getElementById('puzzle-container');
    const rect = container.getBoundingClientRect();
    
    const newX = e.clientX - rect.left - draggedPiece.offsetX - 32;
    const newY = e.clientY - rect.top - draggedPiece.offsetY - 32;
    
    setPieces(prev => prev.map(p => 
      p.id === draggedPiece.id ? { ...p, currentX: newX, currentY: newY } : p
    ));
  };

  const handleMouseUp = () => {
    if (!draggedPiece) return;
    
    const piece = pieces.find(p => p.id === draggedPiece.id);
    const distX = Math.abs(piece.currentX - piece.correctX);
    const distY = Math.abs(piece.currentY - piece.correctY);
    
    if (distX < SNAP_THRESHOLD && distY < SNAP_THRESHOLD && !piece.placed) {
      // Snap to correct position
      setPieces(prev => prev.map(p => 
        p.id === draggedPiece.id 
          ? { ...p, currentX: p.correctX, currentY: p.correctY, placed: true }
          : p
      ));
      
      setPlacedPieces(prev => new Set([...prev, draggedPiece.id]));
      
      // Show message
      const newMessage = {
        id: Date.now(),
        text: pieceMessages[draggedPiece.id % pieceMessages.length]
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Check if complete
      if (placedPieces.size + 1 === GRID_SIZE * GRID_SIZE) {
        setTimeout(() => setGameState('complete'), 500);
      }
    }
    
    setDraggedPiece(null);
  };

  const drawPiece = (piece) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = PIECE_SIZE;
    tempCanvas.height = PIECE_SIZE;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.drawImage(
      canvas,
      piece.col * PIECE_SIZE,
      piece.row * PIECE_SIZE,
      PIECE_SIZE,
      PIECE_SIZE,
      0,
      0,
      PIECE_SIZE,
      PIECE_SIZE
    );
    
    return tempCanvas.toDataURL();
  };

  if (gameState === 'start') {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#07101a] via-[#0b1a26] to-[#071018] text-white overflow-hidden">
        <div className="z-20 max-w-6xl w-full px-6 py-12 flex flex-col items-center">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <Heart className="w-16 h-16 mx-auto text-pink-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Mountains of Christmas', cursive" }}>
                Put the pieces together
              </h1>
              <p className="text-gray-300 text-lg">A simple memory waiting to be whole</p>
            </div>
            <button
              onClick={() => setGameState('playing')}
              className="px-8 py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-all duration-300 shadow-lg"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const img = imageRef.current;
    
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#07101a] via-[#0b1a26] to-[#071018] text-white overflow-hidden">
        <div className="z-20 max-w-6xl w-full px-6 py-12 flex flex-col items-center">
          <div className="text-center space-y-8 animate-[fadeIn_1s_ease-in]">
            <div className="space-y-3">
              <Heart className="w-12 h-12 mx-auto text-pink-400 animate-[heartBeat_1.5s_ease-in-out_infinite]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Mountains of Christmas', cursive" }}>
                Your Memory, Complete
              </h2>
            </div>
            
            <div className="relative inline-block">
              {img && img.complete ? (
                <img 
                  src={img.src} 
                  alt="Complete memory" 
                  className="rounded-2xl shadow-2xl brightness-105 max-w-[500px] max-h-[500px] object-contain border border-white/20"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={PIECE_SIZE * GRID_SIZE}
                  height={PIECE_SIZE * GRID_SIZE}
                  className="rounded-2xl shadow-2xl brightness-105 border border-white/20"
                  style={{ maxWidth: '500px', height: 'auto' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-2xl pointer-events-none" />
            </div>
            
            <div className="space-y-3 max-w-md mx-auto">
              <p className="text-xl text-gray-200 italic">
                Thank you for being part of this memory.
              </p>
              {messages.length > 0 && (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  {messages.slice(-3).map((msg) => (
                    <p key={msg.id} className="text-sm text-gray-300 italic">
                      {msg.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-all duration-300 shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#07101a] via-[#0b1a26] to-[#071018] text-white overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ userSelect: 'none' }}
    >
      <canvas ref={canvasRef} width={PIECE_SIZE * GRID_SIZE} height={PIECE_SIZE * GRID_SIZE} className="hidden" />
      
      <div className="z-20 max-w-6xl w-full px-6 py-12 flex flex-col items-center">
        <h2 
          className="text-2xl md:text-3xl font-bold text-center mb-3 text-white"
          style={{ fontFamily: "'Mountains of Christmas', cursive" }}
        >
          Piece Together Your Memory
        </h2>
        
        <p className="text-center text-lg text-gray-300 mb-8">
          Drag the pieces to complete the memory
        </p>
        
        <div 
          id="puzzle-container"
          className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10"
          style={{ 
            width: PIECE_SIZE * GRID_SIZE + 64,
            height: PIECE_SIZE * GRID_SIZE + 64
          }}
        >
          {pieces.map(piece => (
            <div
              key={piece.id}
              onMouseDown={(e) => handleMouseDown(e, piece)}
              className={`absolute select-none transition-all ${
                piece.placed 
                  ? 'cursor-default' 
                  : draggedPiece?.id === piece.id 
                    ? 'cursor-grabbing' 
                    : 'cursor-grab hover:scale-105'
              }`}
              style={{
                left: piece.currentX + 32,
                top: piece.currentY + 32,
                width: PIECE_SIZE,
                height: PIECE_SIZE,
                backgroundImage: `url(${drawPiece(piece)})`,
                backgroundSize: 'cover',
                borderRadius: '8px',
                boxShadow: piece.placed 
                  ? 'inset 0 0 0 2px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.4)' 
                  : draggedPiece?.id === piece.id
                    ? '0 8px 20px rgba(0,0,0,0.5)'
                    : '0 4px 12px rgba(0,0,0,0.3)',
                opacity: piece.placed ? 1 : 0.95,
                zIndex: draggedPiece?.id === piece.id ? 1000 : piece.placed ? 1 : 10,
                transform: draggedPiece?.id === piece.id ? 'scale(1.05)' : 'scale(1)',
                transition: draggedPiece?.id === piece.id ? 'none' : 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {messages.length > 0 && (
          <div className="mt-8 space-y-2 max-w-md text-center">
            {messages.map((msg, idx) => (
              <p 
                key={msg.id}
                className="text-gray-300 italic animate-[fadeIn_0.8s_ease-in]"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {msg.text}
              </p>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MemoryPuzzle;