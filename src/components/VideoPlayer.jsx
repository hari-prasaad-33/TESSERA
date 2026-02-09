import React, { useState, useRef } from 'react';

/** Extract YouTube video ID from watch, embed, Shorts, or youtu.be URL. */
function getYouTubeVideoId(src) {
  if (!src || typeof src !== 'string') return null;
  const trimmed = src.trim();
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = trimmed.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  return null;
}

/**
 * Reusable video player: local MP4 or YouTube (unlisted) embed.
 * - Local: src="/videos/your-file.mp4" (file in public/videos/)
 * - YouTube: src="https://www.youtube.com/watch?v=VIDEO_ID" or embed URL
 */
const VideoPlayer = ({ src, poster, title, titleClassName = 'text-tessera-teal', className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  const youtubeId = getYouTubeVideoId(src);
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?rel=0` : null;

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

  if (hasError && !youtubeId) {
    return (
      <div className={`w-full aspect-video bg-black/50 rounded-xl border border-white/10 flex items-center justify-center ${className}`}>
        <p className="text-tessera-dim text-sm font-mono">Video not found. Add your video to <code className="text-tessera-teal">public/videos/</code> or use a YouTube URL.</p>
      </div>
    );
  }

  if (embedUrl) {
    return (
      <div
        className={`relative w-full aspect-video bg-black/50 rounded-xl border border-white/10 overflow-hidden ${className}`}
        style={{ boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
      >
        <iframe
          src={embedUrl}
          title={title || 'YouTube video'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {title && (
          <p className={`absolute bottom-6 left-0 w-full text-center text-xs tracking-[0.2em] font-mono z-10 pointer-events-none ${titleClassName}`}>
            {title}
          </p>
        )}
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
