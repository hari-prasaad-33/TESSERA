import React, { useState, useRef } from 'react';

/**
 * Reusable video player with play/pause overlay.
 * Place video files in public/videos/ and reference as: src="/videos/your-file.mp4"
 */
const VideoPlayer = ({ src, poster, title, titleClassName = 'text-tessera-teal', className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => setIsPlaying(false);
  const handleError = () => setHasError(true);

  if (hasError) {
    return (
      <div className={`w-full aspect-video bg-black/50 rounded-xl border border-white/10 flex items-center justify-center ${className}`}>
        <p className="text-tessera-dim text-sm font-mono">Video not found. Add your video to <code className="text-tessera-teal">public/videos/</code></p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video bg-black/50 rounded-xl border border-white/10 overflow-hidden group cursor-pointer ${className}`}
      onClick={togglePlay}
      style={{ boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        onEnded={handleEnded}
        onError={handleError}
      />
      {/* Play/pause overlay - shown when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-500 z-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </div>
        </div>
      )}
      {title && (
        <p className={`absolute bottom-6 left-0 w-full text-center text-xs tracking-[0.2em] font-mono z-10 pointer-events-none ${titleClassName}`}>
          {title}
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
