import React from 'react';
import VideoPlayer from './VideoPlayer';

/**
 * Founder's video section for the home page.
 * Use a local file (public/videos/founders-video.mp4) or a YouTube unlisted URL.
 */
const FounderVideoSection = () => {
  const FOUNDER_VIDEO_SRC = 'https://youtube.com/shorts/s_2-AlZaKvU';

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6">
      <div className="glass-card p-10 md:p-16 rounded-3xl border border-white/5 bg-gradient-to-br from-tessera-void to-tessera-ink relative animate-fade-in">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-light leading-tight mb-4 text-tessera-teal tracking-tight">
            From the Founder
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl font-light">
            Hear the story behind Tessera—why we build it, and what we believe about the future of music creation.
          </p>
          <VideoPlayer src={FOUNDER_VIDEO_SRC} />
        </div>
      </div>
    </section>
  );
};

export default FounderVideoSection;
