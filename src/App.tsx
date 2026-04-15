import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  const handleGameOver = () => {};

  return (
    <div className="h-screen w-full bg-black text-[#0ff] font-['VT323',monospace] overflow-hidden grid grid-cols-[280px_1fr_240px] grid-rows-[80px_1fr_120px] gap-6 p-6 relative">
      <div className="scanlines"></div>
      <div className="static-noise"></div>

      {/* Header */}
      <header className="col-span-3 row-start-1 bg-black flex items-center justify-between px-8 border-glitch z-10">
        <div className="font-extrabold text-5xl tracking-[4px] uppercase text-white glitch-text" data-text="SYS.SNAKE_ERR">
          SYS.SNAKE_ERR
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col items-end">
            <span className="text-xl uppercase text-[#f0f] tracking-[2px]">MEM_SCORE</span>
            <span className="text-4xl text-[#0ff]">{score.toString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl uppercase text-[#f0f] tracking-[2px]">MAX_OVERFLOW</span>
            <span className="text-4xl text-[#0ff]">{highScore.toString()}</span>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="col-start-2 row-start-2 bg-black flex items-center justify-center relative border-glitch-magenta z-10">
        <SnakeGame onScoreChange={handleScoreChange} onGameOver={handleGameOver} />
      </main>

      {/* Music Player (Sidebar, Visualizer, Footer) */}
      <MusicPlayer />
    </div>
  );
}
