'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Tv,
  Check,
} from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  lessonTitle?: string;
  courseTitle?: string;
  durationSeconds?: number;
  onEnded?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function VideoPlayer({
  videoUrl,
  lessonTitle = 'Interactive Video Lesson',
  courseTitle = 'Course Stream',
  durationSeconds = 0,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<number>(0);
  const [actionIndicator, setActionIndicator] = useState<'play' | 'pause' | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube ID if URL is a YouTube link
  const youtubeId = useMemo(() => {
    if (!videoUrl) return null;
    const match = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }, [videoUrl]);

  // Construct hardened YouTube embed URL with zero YouTube chrome
  const youtubeEmbedUrl = useMemo(() => {
    if (!youtubeId) return null;
    const params = new URLSearchParams({
      autoplay: '0',
      controls: '0',
      disablekb: '1',
      fs: '0',
      modestbranding: '1',
      rel: '0',
      showinfo: '0',
      iv_load_policy: '3',
      playsinline: '1',
      enablejsapi: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
  }, [youtubeId]);

  // Send command to YouTube iframe via postMessage
  const postToYouTube = useCallback((func: string, args: (string | number | boolean)[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      } catch {
        // Ignore cross-origin security errors
      }
    }
  }, []);

  // Listen to YouTube player messages
  useEffect(() => {
    if (!youtubeId) return;

    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            if (!isDragging) {
              setCurrentTime(data.info.currentTime);
            }
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
          if (typeof data.info.playerState === 'number') {
            // 1: playing, 2: paused, 0: ended
            if (data.info.playerState === 1) {
              setIsPlaying(true);
              setHasStarted(true);
            } else if (data.info.playerState === 2) {
              setIsPlaying(false);
            } else if (data.info.playerState === 0) {
              setIsPlaying(false);
              onEnded?.();
            }
          }
        }
      } catch {
        // Non-JSON message from other origins
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [youtubeId, isDragging, onEnded]);

  // Request YouTube listening state on iframe load
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    }
  };

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls when playing and inactive
  const resetControlsTimeout = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
        setShowSpeedMenu(false);
      }, 3000);
    }
  }, [isPlaying]);

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  const triggerActionSplash = (action: 'play' | 'pause') => {
    setActionIndicator(action);
    setTimeout(() => {
      setActionIndicator(null);
    }, 600);
  };

  // Play / Pause toggler
  const togglePlay = () => {
    if (youtubeId) {
      if (isPlaying) {
        postToYouTube('pauseVideo');
        setIsPlaying(false);
        triggerActionSplash('pause');
      } else {
        postToYouTube('playVideo');
        setIsPlaying(true);
        setHasStarted(true);
        triggerActionSplash('play');
      }
    } else if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setHasStarted(true);
        triggerActionSplash('play');
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        triggerActionSplash('pause');
      }
    }
    resetControlsTimeout();
  };

  // Seek handler
  const handleSeek = useCallback((seconds: number) => {
    const target = Math.max(0, Math.min(seconds, duration || 100));
    setCurrentTime(target);
    if (youtubeId) {
      postToYouTube('seekTo', [target, true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  }, [duration, youtubeId, postToYouTube]);

  const skipSeconds = (delta: number) => {
    handleSeek(currentTime + delta);
    resetControlsTimeout();
  };

  // Volume handler
  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(newVol, 1));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (youtubeId) {
      if (clamped === 0) {
        postToYouTube('mute');
      } else {
        postToYouTube('unMute');
        postToYouTube('setVolume', [Math.round(clamped * 100)]);
      }
    } else if (videoRef.current) {
      videoRef.current.volume = clamped;
      videoRef.current.muted = clamped === 0;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const restoreVol = volume > 0 ? volume : 0.8;
      setVolume(restoreVol);
      if (youtubeId) {
        postToYouTube('unMute');
        postToYouTube('setVolume', [Math.round(restoreVol * 100)]);
      } else if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = restoreVol;
      }
    } else {
      setIsMuted(true);
      if (youtubeId) {
        postToYouTube('mute');
      } else if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  };

  // Speed handler
  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (youtubeId) {
      postToYouTube('setPlaybackRate', [rate]);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Fullscreen toggler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Global drag handler for smooth scrub bar dragging
  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!progressBarRef.current || !duration) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
      setCurrentTime(percentage * duration);
    };
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!progressBarRef.current || !duration) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
      handleSeek(percentage * duration);
      setIsDragging(false);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, duration, handleSeek]);

  // Scrub bar interaction
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
    handleSeek(percentage * duration);
  };

  const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(hoverX / rect.width, 1));
    setHoverTime(percentage * duration);
    setHoverPos(hoverX);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) setControlsVisible(false);
        setShowSpeedMenu(false);
      }}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#090b10] border border-white/[0.08] shadow-2xl select-none group font-mono"
    >
      {/* 1. Underlying Video Layer (YouTube Embed or Native MP4) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center">
        {youtubeEmbedUrl ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* 
              Scale and crop iframe slightly (scale-110) inside overflow-hidden.
              This pushes YouTube's top title bar and bottom watermark completely outside
              the bounding box. pointer-events-none prevents YouTube from receiving hover events.
            */}
            <iframe
              ref={iframeRef}
              src={youtubeEmbedUrl}
              title={lessonTitle}
              onLoad={handleIframeLoad}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[114%] h-[114%] pointer-events-none border-0 aspect-video select-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              tabIndex={-1}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={() => {
              if (videoRef.current && !isDragging) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              onEnded?.();
            }}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* 2. Transparent Click & Gesture Interception Layer */}
      <div
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className="absolute inset-0 cursor-pointer z-10"
        title="Click to play/pause • Double-click for fullscreen"
      />

      {/* 3. Action Flash Indicator (Center Ripple when clicked) */}
      {actionIndicator && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-400 flex items-center justify-center animate-ping">
            {actionIndicator === 'play' ? (
              <Play className="w-8 h-8 fill-amber-400" />
            ) : (
              <Pause className="w-8 h-8 fill-amber-400" />
            )}
          </div>
        </div>
      )}

      {/* 4. Initial Custom Poster Splash (Visible before user starts playback) */}
      {!hasStarted && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#090b10] via-[#090b10]/85 to-[#090b10]/95 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-opacity duration-500 group/splash"
        >
          {/* Subtle Technical Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center max-w-lg space-y-4">
            {/* Live Stream / Lesson Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{courseTitle}</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-400">Full HD 1080p</span>
            </div>

            {/* Lesson Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {lessonTitle}
            </h2>

            {/* Big Glowing Amber Play Button */}
            <div className="pt-2">
              <button
                type="button"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] group-hover/splash:scale-110 group-hover/splash:shadow-[0_0_40px_rgba(245,158,11,0.8)] transition-all duration-300"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-black translate-x-0.5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-mono tracking-wide pt-1">
              Click anywhere to start lesson stream
            </p>
          </div>
        </div>
      )}

      {/* 5. Custom Top Disguise Header Overlay */}
      <div
        className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#090b10] via-[#090b10]/80 to-transparent z-20 px-4 sm:px-6 flex items-center justify-between transition-opacity duration-300 pointer-events-none ${
          controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate max-w-[70%]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
          <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase shrink-0">
            [ LESSON STREAM ]
          </span>
          <span className="text-white/20 shrink-0">|</span>
          <span className="text-xs font-semibold text-slate-200 truncate">
            {lessonTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded">
            1080p 60FPS
          </span>
        </div>
      </div>

      {/* 6. Custom Bottom Control Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-[#090b10] via-[#090b10]/95 to-transparent pt-8 pb-3 px-3 sm:px-5 space-y-2 transition-all duration-300 ${
          controlsVisible || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {/* Scrubber Progress Bar */}
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          onMouseMove={handleProgressBarHover}
          onMouseLeave={() => setHoverTime(null)}
          onMouseDown={() => setIsDragging(true)}
          className="relative h-2 group/scrubber cursor-pointer flex items-center"
        >
          {/* Background Track */}
          <div className="w-full h-1 group-hover/scrubber:h-2 rounded-full bg-white/20 transition-all overflow-hidden">
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scrubber Thumb Knob */}
          <div
            className="absolute w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-black shadow-[0_0_10px_rgba(245,158,11,0.8)] -translate-x-1/2 opacity-0 group-hover/scrubber:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 bg-[#0c0e17] text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/[0.1] shadow-lg pointer-events-none"
              style={{ left: `${hoverPos}px` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-2 text-slate-300 text-xs">
          {/* Left Controls: Play/Pause, Skips, Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current text-amber-400" />
              ) : (
                <Play className="w-4 h-4 fill-current text-amber-400" />
              )}
            </button>

            {/* Skip -10s */}
            <button
              type="button"
              onClick={() => skipSeconds(-10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition hidden sm:inline-flex"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip +10s */}
            <button
              type="button"
              onClick={() => skipSeconds(10)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition hidden sm:inline-flex"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume / Mute */}
            <div className="flex items-center gap-1.5 group/volume relative">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 accent-amber-500 bg-white/20 rounded cursor-pointer hidden sm:block opacity-70 hover:opacity-100 transition"
              />
            </div>

            {/* Time Indicator */}
            <div className="text-[11px] font-mono text-slate-400 ml-1">
              <span className="text-slate-200 font-bold">{formatTime(currentTime)}</span>
              <span className="text-white/30 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed, Quality, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Playback Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded text-[11px] font-mono text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition"
                title="Playback Speed"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-24 bg-[#0c0e17] border border-white/[0.1] rounded-lg shadow-2xl p-1 z-30 font-mono text-xs space-y-0.5">
                  <div className="px-2 py-1 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Speed
                  </div>
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changeSpeed(rate)}
                      className={`w-full px-2 py-1 rounded flex items-center justify-between text-left transition ${
                        playbackRate === rate
                          ? 'bg-amber-500/20 text-amber-400 font-bold'
                          : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span>{rate}x</span>
                      {playbackRate === rate && <Check className="w-3 h-3 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stream Engine Tag */}
            <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-500 font-mono px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05]">
              <Tv className="w-3 h-3 text-emerald-400" />
              <span>ST-DIRECT</span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
              title={isFullscreen ? 'Exit Fullscreen (f)' : 'Fullscreen (f)'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
