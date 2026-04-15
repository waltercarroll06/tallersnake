import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "CORRUPT_SECTOR_1", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "DATA_BREACH.WAV", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "NULL_POINTER", artist: "GHOST_IN_RAM", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.82);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />

      <aside className="col-start-1 row-start-2 bg-black p-6 flex flex-col gap-5 border-glitch z-10">
        <h3 className="text-3xl uppercase text-[#f0f] tracking-[2px] border-b-4 border-[#0ff] pb-2 glitch-text" data-text="AUDIO_LOGS">AUDIO_LOGS</h3>
        <div className="flex flex-col gap-4">
          {TRACKS.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => { setCurrentTrackIndex(index); setIsPlaying(true); }}
              className={`p-3 cursor-pointer transition-all ${
                currentTrackIndex === index 
                  ? 'border-l-8 border-[#f0f] bg-[#0ff] text-black' 
                  : 'border-l-8 border-transparent bg-black text-[#0ff] hover:bg-[#f0f] hover:text-black'
              }`}
            >
              <div className="text-2xl font-bold mb-1 uppercase">{track.title}</div>
              <div className="text-lg uppercase">{track.artist}</div>
            </div>
          ))}
        </div>
      </aside>

      <aside className="col-start-3 row-start-2 bg-black p-6 flex flex-col justify-center gap-3 border-glitch z-10">
        {[40, 85, 60, 95, 30, 75, 50, 90, 20, 45, 80, 55].map((width, i) => (
          <div 
            key={i} 
            className={`h-[16px] transition-all duration-75 ${i % 2 === 0 ? 'bg-[#0ff]' : 'bg-[#f0f]'}`}
            style={{ width: isPlaying ? `${Math.random() * 80 + 20}%` : `${width}%`, transform: isPlaying ? `skew(${Math.random() * 40 - 20}deg)` : 'none' }}
          />
        ))}
      </aside>

      <footer className="col-span-3 row-start-3 bg-black grid grid-cols-[1fr_2fr_1fr] items-center px-8 border-glitch z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#f0f] flex items-center justify-center font-bold text-black text-3xl border-4 border-[#0ff]">
            {currentTrack.title.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-3xl font-bold text-[#0ff] uppercase">{currentTrack.title}</div>
            <div className="text-xl text-[#f0f] uppercase">{currentTrack.artist}</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-8 items-center">
            <button onClick={handlePrev} className="text-[#0ff] hover:text-[#f0f] hover:scale-125 transition-all">
              <SkipBack className="w-8 h-8" />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-16 h-16 bg-[#0ff] text-black flex items-center justify-center hover:bg-[#f0f] transition-colors border-4 border-black"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            <button onClick={handleNext} className="text-[#0ff] hover:text-[#f0f] hover:scale-125 transition-all">
              <SkipForward className="w-8 h-8" />
            </button>
          </div>
          <div className="w-full max-w-[500px] h-[12px] bg-black border-2 border-[#0ff] relative cursor-pointer"
            onClick={(e) => {
              if (audioRef.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                audioRef.current.currentTime = pos * audioRef.current.duration;
              }
            }}
          >
            <div 
              className="h-full bg-[#f0f] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 text-[#0ff] text-2xl">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[#f0f]">
            {isMuted || volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
          </button>
          <span>VOL [{Math.round((isMuted ? 0 : volume) * 100)}%]</span>
        </div>
      </footer>
    </>
  );
};
