'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface CurtainVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  isBackground?: boolean;
}

export default function CurtainVideoPlayer({
  src,
  poster,
  title,
  className = '',
  autoPlay = false,
  isBackground = false
}: CurtainVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(isBackground || false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion for background autoPlay
    if (isBackground && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [isBackground]);

  // Global single video coordinator: pause others when this starts playing
  const handlePlay = () => {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => {
      if (v !== videoRef.current && !v.paused) {
        v.pause();
      }
    });
    setIsPlaying(true);
    setHasStarted(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(handlePlay).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setProgress(dur > 0 ? (curr / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = Number(e.target.value);
    const targetTime = (val / 100) * (duration || 1);
    videoRef.current.currentTime = targetTime;
    setProgress(val);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isBackground) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative group bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-200/20 ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onPlay={handlePlay}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Center Big Play Button before starting or when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-amber-700/80 hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 transform hover:scale-110 z-10"
        >
          <Play className="w-9 h-9 fill-white translate-x-0.5" />
        </button>
      )}

      {/* Video Title Header Overlay */}
      {title && (
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent pointer-events-none z-10">
          <p className="text-white text-sm md:text-base font-medium tracking-wide drop-shadow-md">
            {title}
          </p>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-3 md:p-4 bg-gradient-to-t from-stone-950/90 via-stone-950/60 to-transparent transition-opacity duration-300 z-10 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar Slider */}
        <div className="relative mb-2 group/bar">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-white text-xs md:text-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-amber-300"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-amber-300" /> : <Play className="w-5 h-5 fill-amber-300" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/20 transition"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-amber-200" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>

            <span className="text-stone-300 font-mono text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-stone-200 hover:text-white"
              aria-label="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
