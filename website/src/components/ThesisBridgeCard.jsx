export default function ThesisBridgeCard() {
  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5">
      <div className="border-l-2 border-[#ffb84d]/40 pl-5 sm:pl-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#8d94ab]">Tessera thesis</div>
        <p className="texture-type-shadow mt-3 text-[1.85rem] leading-[0.98] text-[#f0ebe0] sm:text-[2.35rem]">
          Process over shortcuts.
        </p>
        <p className="texture-type-shadow-soft mt-3 max-w-xl text-base leading-relaxed text-[#d0d7e4] sm:text-lg">
          We use intelligence to remove friction, not authorship. The machine can suggest. The artist still decides.
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.26em] text-[#99a3b7]">
          Visible moves · Editable handoff · Artist in control
        </p>
      </div>
    </div>
  );
}
