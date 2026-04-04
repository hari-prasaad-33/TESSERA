/**
 * Full-bleed panel textures (sections 04+). Add new Poly Haven *_diff_4k.jpg files to
 * textures-source, run `npm run convert:textures`, then point `src` at the generated slug.
 */
export const sectionBackgrounds = {
  howWeBuild: {
    src: '/images/textures/coast-sand-rocks.jpg',
    opacity: 0.48,
    position: 'center 20%',
    filter: 'saturate(0.92) contrast(1.1) brightness(0.38)',
    baseTint: 'bg-[#0a1016]',
    overlayClass:
      'bg-[linear-gradient(165deg,rgba(6,14,22,0.88)_0%,rgba(8,12,18,0.72)_40%,rgba(4,10,16,0.9)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(93,212,240,0.08),transparent_55%)]',
  },
  products: {
    src: '/images/textures/cliff-side.jpg',
    opacity: 0.52,
    position: 'center bottom',
    filter: 'saturate(0.9) contrast(1.12) brightness(0.4)',
    baseTint: 'bg-[#100c08]',
    overlayClass:
      'bg-[linear-gradient(195deg,rgba(12,8,5,0.82)_0%,rgba(8,6,4,0.78)_50%,rgba(6,5,3,0.92)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_80%_60%_at_70%_100%,rgba(255,106,51,0.06),transparent_50%)]',
  },
  vision: {
    src: '/images/textures/moon-01.jpg',
    opacity: 0.42,
    position: 'center 35%',
    filter: 'saturate(0.85) contrast(1.06) brightness(0.48)',
    baseTint: 'bg-[#06060f]',
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(6,6,14,0.82)_0%,rgba(4,4,12,0.65)_45%,rgba(3,3,10,0.88)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_100%_80%_at_50%_120%,rgba(93,212,240,0.07),transparent_45%)]',
  },
};
