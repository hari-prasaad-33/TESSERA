export default function TextureVeil({
  src,
  opacity = 0.42,
  size = 'cover',
  position = 'center',
  repeat = false,
  filter = 'grayscale(0.22) saturate(0.74) contrast(1.06) brightness(0.42)',
  blend = 'normal',
  className = '',
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `url('${src}')`,
        backgroundPosition: position,
        backgroundRepeat: repeat ? 'repeat' : 'no-repeat',
        backgroundSize: size,
        mixBlendMode: blend,
        opacity,
        filter: filter || undefined,
      }}
    />
  );
}
