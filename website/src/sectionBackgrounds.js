/**
 * Full-bleed panel textures. Add new Poly Haven *_diff_4k.jpg to textures-source,
 * run `npm run convert:textures`, then reference the generated slug here.
 */

/** Left-weighted darkening so type reads on texture without card boxes (Colossal-style). */
export const contentLaneScrim =
  'bg-[linear-gradient(90deg,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.22)_45%,rgba(0,0,0,0.05)_72%,transparent_100%)]';

export const sectionBackgrounds = {
  howWeBuild: {
    src: '/images/textures/coast-sand-rocks.jpg',
    opacity: 0.76,
    position: 'center 20%',
    filter: 'saturate(0.95) contrast(1.08) brightness(0.62) hue-rotate(-8deg)',
    baseTint: 'bg-[#141e2a]',
    overlayClass:
      'bg-[linear-gradient(165deg,rgba(14,22,36,0.42)_0%,rgba(16,24,38,0.34)_45%,rgba(10,18,32,0.46)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(93,212,240,0.14),transparent_58%)]',
    contentLaneClass: contentLaneScrim,
  },
  howWeBuildCont: {
    src: '/images/textures/lichen-rock.jpg',
    opacity: 0.66,
    position: 'center 30%',
    filter: 'saturate(1.05) contrast(1.08) brightness(0.58) hue-rotate(12deg)',
    baseTint: 'bg-[#0f1c1e]',
    overlayClass:
      'bg-[linear-gradient(200deg,rgba(8,26,28,0.44)_0%,rgba(10,22,24,0.36)_50%,rgba(6,18,20,0.48)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_85%_60%_at_30%_0%,rgba(93,212,240,0.1),transparent_55%)]',
    contentLaneClass: contentLaneScrim,
  },
  products: {
    src: '/images/textures/cliff-side.jpg',
    opacity: 0.74,
    position: 'center bottom',
    filter: 'saturate(0.95) contrast(1.08) brightness(0.62)',
    baseTint: 'bg-[#1e1814]',
    overlayClass:
      'bg-[linear-gradient(195deg,rgba(18,14,10,0.4)_0%,rgba(14,12,8,0.36)_50%,rgba(12,10,6,0.46)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_85%_65%_at_70%_100%,rgba(255,184,77,0.1),transparent_55%)]',
    contentLaneClass: contentLaneScrim,
  },
  vision: {
    src: '/images/textures/rogland-clear-night.jpg',
    opacity: 0.72,
    position: 'center 80%',
    filter: 'saturate(0.88) contrast(1.1) brightness(0.55)',
    baseTint: 'bg-[#0e1018]',
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(10,12,22,0.34)_0%,rgba(8,10,18,0.26)_45%,rgba(6,8,16,0.38)_100%)]',
    vignetteClass: 'bg-[radial-gradient(ellipse_100%_80%_at_50%_120%,rgba(93,212,240,0.1),transparent_50%)]',
    contentLaneClass: contentLaneScrim,
  },
};
