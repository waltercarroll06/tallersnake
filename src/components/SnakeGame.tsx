import React, { useEffect, useRef, useState } from 'react';

interface Point { x: number; y: number; }
interface SnakeGameProps { onScoreChange: (score: number) => void; onGameOver: () => void; }

const GRID_SIZE = 20;
const CANVAS_SIZE = 480;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setFood({ x: 15, y: 15 });
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': case 'S': if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': case 'A': if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 }); break;
        case ' ': if (isGameOver) resetGame(); else setIsPaused((p) => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

        if (newHead.x < 0 || newHead.x >= TILE_COUNT || newHead.y < 0 || newHead.y >= TILE_COUNT) {
          setIsGameOver(true); onGameOver(); return prevSnake;
        }
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true); onGameOver(); return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore); onScoreChange(newScore);
          setFood({ x: Math.floor(Math.random() * TILE_COUNT), y: Math.floor(Math.random() * TILE_COUNT) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const interval = setInterval(moveSnake, 80); // Faster for glitch aesthetic
    return () => clearInterval(interval);
  }, [food, isGameOver, isPaused, onGameOver, onScoreChange, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = '#0ff';
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Glitch offset randomizer
    const glitchX = Math.random() > 0.9 ? (Math.random() * 10 - 5) : 0;

    ctx.fillStyle = '#f0f';
    ctx.fillRect(food.x * GRID_SIZE + glitchX, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#fff' : '#0ff';
      ctx.fillRect(segment.x * GRID_SIZE + glitchX, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x * GRID_SIZE + glitchX, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#f0f';
      ctx.font = '40px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FATAL_ERROR', CANVAS_SIZE / 2 - 4, CANVAS_SIZE / 2 - 20);
      ctx.fillStyle = '#0ff';
      ctx.fillText('FATAL_ERROR', CANVAS_SIZE / 2 + 4, CANVAS_SIZE / 2 - 20);
      ctx.fillStyle = '#fff';
      ctx.fillText('FATAL_ERROR', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
      
      ctx.font = '20px "VT323", monospace';
      ctx.fillText('PRESS [SPACE] TO REBOOT', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#0ff';
      ctx.font = '40px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM_PAUSED', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }
  }, [snake, food, isGameOver, isPaused]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-[480px] h-[480px]"
      />
    </div>
  );
};
