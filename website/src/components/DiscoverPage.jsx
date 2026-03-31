import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { fetchMarkdownContent, parseMarkdownSection } from '../utils/markdown';
import VideoPlayer from './VideoPlayer';

// Path to demo video - place file at: public/videos/tessera-one-demo.mp4
const DEMO_VIDEO_SRC = '/videos/tessera-one-demo.mp4';

const DiscoverPage = ({ onBack }) => {
  const [contentParts, setContentParts] = useState({ before: '', after: '' });

  useEffect(() => {
    fetchMarkdownContent().then(markdown => {
      let content = parseMarkdownSection(markdown, 'Discover Plugin');
      const placeholderRegex = /^\*\*\[VIDEO PLACEHOLDER\].*$/m;
      const split = content.split(placeholderRegex);
      const before = split[0]?.trim() ?? '';
      const after = split[1]?.trim() ?? '';
      setContentParts({
        before: marked.parse(before),
        after: marked.parse(after)
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-tessera-ink text-gray-300 font-sans pt-32 pb-20 px-6 animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-tessera-teal/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-tessera-orange/5 rounded-full blur-[150px]"></div>
      </div>


      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-light text-white mb-6 tracking-tight">
            Discover <span className="text-tessera-orange">Tessera One</span>
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-tessera-orange/50 to-transparent mx-auto"></div>
        </div>

        {/* Content */}
        <div className="glass-card p-8 md:p-20 rounded-3xl border border-white/5 relative bg-[#050505]/40 backdrop-blur-xl">
           <div 
             className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-display prose-headings:font-light prose-h3:text-tessera-teal prose-h3:text-3xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:tracking-wide
                        prose-p:leading-loose prose-p:text-gray-400 prose-p:mb-6
                        prose-strong:text-white prose-strong:font-normal
                        prose-ul:list-none prose-ul:pl-0 prose-li:mb-4 prose-li:pl-6 prose-li:relative
                        prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-tessera-orange prose-li:before:rounded-full
                        "
             dangerouslySetInnerHTML={{ __html: contentParts.before }}
           />
           <div className="my-12">
             <VideoPlayer src={DEMO_VIDEO_SRC} />
           </div>
           <div 
             className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-display prose-headings:font-light prose-h3:text-tessera-teal prose-h3:text-3xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:tracking-wide
                        prose-p:leading-loose prose-p:text-gray-400 prose-p:mb-6
                        prose-strong:text-white prose-strong:font-normal
                        prose-ul:list-none prose-ul:pl-0 prose-li:mb-4 prose-li:pl-6 prose-li:relative
                        prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-tessera-orange prose-li:before:rounded-full
                        "
             dangerouslySetInnerHTML={{ __html: contentParts.after }}
           />
        </div>
        
        {/* Footer Action */}
        <div className="mt-16 text-center">
            <button className="bg-tessera-orange text-black px-12 py-5 rounded-full font-mono font-bold tracking-wider hover:bg-white transition duration-500 shadow-[0_0_30px_rgba(255,95,31,0.3)]">
              GET TESSERA ONE
            </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
