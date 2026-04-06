const EternalRing = () => {
  const text = ' TESSERA · TESSERA EQ · TESSERA ONE · EST 2026 ';
  const chars = text.split('');
  
  return (
    <div className="relative mx-auto flex h-64 w-64 max-w-full items-center justify-center opacity-30 transition-opacity duration-700 hover:opacity-100">
      <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '40s' }}>
        {chars.map((char, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 text-[10px] font-mono tracking-widest text-tessera-dim origin-[0_128px]"
            style={{ transform: `rotate(${i * (360 / chars.length)}deg)` }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="w-32 h-32 rounded-full border border-tessera-teal/20"></div>
    </div>
  );
};

export default EternalRing;
