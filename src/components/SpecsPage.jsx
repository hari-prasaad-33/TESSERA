import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { fetchMarkdownContent, parseMarkdownSection } from '../utils/markdown';

const SpecsPage = ({ onBack }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetchMarkdownContent().then(markdown => {
      const content = parseMarkdownSection(markdown, 'Read Specs');
      setHtmlContent(marked.parse(content));
    });
  }, []);

  return (
    <div className="min-h-screen bg-tessera-ink text-gray-300 font-sans pt-32 pb-20 px-6 animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-tessera-teal/5 rounded-full blur-[150px]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-tessera-dim hover:text-white transition-colors group">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-mono text-xs tracking-widest">BACK</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-light text-white mb-6 tracking-tight">
            Technical <span className="text-tessera-teal">Specifications</span>
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-tessera-teal/50 to-transparent mx-auto"></div>
        </div>

        <div className="glass-card p-8 md:p-20 rounded-3xl border border-white/5 relative bg-[#050505]/40 backdrop-blur-xl">
           <div 
             className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-display prose-headings:font-light prose-h3:text-tessera-orange prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:tracking-widest prose-h3:uppercase prose-h3:border-b prose-h3:border-white/10 prose-h3:pb-4
                        prose-p:text-gray-400 prose-p:mb-4
                        prose-strong:text-white prose-strong:font-mono prose-strong:text-sm prose-strong:uppercase prose-strong:tracking-wider
                        
                        /* Table Styling - Data Readout Look */
                        prose-table:w-full prose-table:text-left prose-table:my-10 prose-table:border-collapse prose-table:bg-white/5 prose-table:rounded-lg prose-table:overflow-hidden
                        prose-th:font-mono prose-th:text-xs prose-th:text-tessera-dim prose-th:uppercase prose-th:tracking-widest prose-th:p-4 prose-th:bg-white/5 prose-th:border-b prose-th:border-white/5
                        prose-td:p-4 prose-td:border-b prose-td:border-white/5 prose-td:text-sm prose-td:text-gray-300
                        prose-tr:hover:bg-white/5 prose-tr:transition-colors
                        
                        prose-code:bg-black/80 prose-code:px-3 prose-code:py-1 prose-code:rounded prose-code:text-tessera-teal prose-code:font-mono prose-code:text-xs prose-code:border prose-code:border-white/10
                        prose-pre:bg-black/80 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-6"
             dangerouslySetInnerHTML={{ __html: htmlContent }}
           />
        </div>
        
        {/* Footer Action */}
        <div className="mt-16 text-center">
            <button className="px-12 py-5 rounded-full font-mono font-bold tracking-wider border border-white/10 hover:border-tessera-teal hover:text-tessera-teal hover:bg-tessera-teal/5 transition duration-500">
              DOWNLOAD MANUAL
            </button>
        </div>
      </div>
    </div>
  );
};

export default SpecsPage;
