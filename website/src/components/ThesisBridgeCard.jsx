export default function ThesisBridgeCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(135deg,rgba(7,10,16,0.96),rgba(15,10,14,0.82))] p-6 shadow-[0_34px_90px_rgba(0,0,0,0.56)] backdrop-blur-xl sm:p-7 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_24%,rgba(93,212,240,0.14),transparent_30%),radial-gradient(circle_at_86%_26%,rgba(255,184,77,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_44%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-[36%] lg:block">
        <div className="absolute inset-[14%] rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(7,10,16,0.18))]" />
        <div className="absolute inset-y-[22%] left-[24%] right-[18%] rounded-[1.35rem] bg-[radial-gradient(circle_at_30%_35%,rgba(93,212,240,0.12),transparent_30%),linear-gradient(180deg,rgba(5,8,14,0.1),rgba(5,8,14,0.76))]" />
        <div className="absolute right-[18%] top-[25%] h-24 w-24 rounded-full border border-[#5dd4f0]/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.12),rgba(7,10,16,0.94)_66%)] shadow-[0_0_28px_rgba(93,212,240,0.12)]" />
        <div className="absolute bottom-[24%] left-[26%] right-[22%] grid grid-cols-2 gap-3">
          <div className="rounded-[1rem] border border-white/10 bg-black/24 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#d7edf3]">Visible</div>
          <div className="rounded-[1rem] border border-white/10 bg-black/24 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#ffe1af]">Editable</div>
        </div>
      </div>

      <div className="relative grid gap-5 sm:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.9fr)] sm:items-end lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">Tessera thesis</div>
          <p className="mt-4 text-[1.95rem] leading-[0.98] text-[#f0ebe0] sm:text-[2.45rem]">
            Process over shortcuts.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#d0d7e4] sm:text-base">
            We use intelligence to remove friction, not authorship. The machine can suggest. The artist still decides.
          </p>
        </div>

        <div className="grid gap-3 font-mono text-[10px] uppercase tracking-[0.24em]">
          <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3 text-[#d7edf3]">Visible moves</div>
          <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3 text-[#ffe1af]">Editable handoff</div>
          <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3 text-[#d7edf3]">Artist in control</div>
        </div>
      </div>
    </div>
  );
}
