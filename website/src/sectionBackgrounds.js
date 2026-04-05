/**
 * Full-bleed panel textures (sections 04+). Add new Poly Haven *_diff_4k.jpg files to
 * textures-source, run `npm run convert:textures`, then point `src` at the generated slug.
 */
export const sectionBackgrounds = {
  howWeBuild: {
    src: '/images/textures/coast-sand-rocks.jpg',
    opacity: 0.72,
    position: 'center 20%',
    filter: 'saturate(1.02) contrast(1.06) brightness(0.58)',
    baseTint: 'bg-[#141c26]',
    overlayClass:
      'bg-[linear-gradient(165deg,rgba(12,20,30,0.45)_0%,rgba(14,18,28,0.38)_45%,rgba(10,16,24,0.52)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(93,212,240,0.12),transparent_58%)]',
  },
  products: {
    src: '/images/textures/cliff-side.jpg',
    opacity: 0.7,
    position: 'center bottom',
    filter: 'saturate(0.95) contrast(1.08) brightness(0.56)',
    baseTint: 'bg-[#1a1410]',
    overlayClass:
      'bg-[linear-gradient(195deg,rgba(18,14,10,0.48)_0%,rgba(14,12,8,0.42)_50%,rgba(12,10,6,0.55)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_85%_65%_at_70%_100%,rgba(255,184,77,0.1),transparent_55%)]',
  },
  vision: {
    src: '/images/textures/moon-01.jpg',
    opacity: 0.68,
    position: 'center 35%',
    filter: 'saturate(0.92) contrast(1.04) brightness(0.64)',
    baseTint: 'bg-[#0e101c]',
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(10,12,22,0.42)_0%,rgba(8,10,18,0.32)_45%,rgba(6,8,16,0.48)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_100%_80%_at_50%_120%,rgba(93,212,240,0.1),transparent_50%)]',
  },
};
