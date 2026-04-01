export default function SectionMarker({
  number,
  title,
  className = '',
  align = 'left',
}) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`section-marker ${alignment} ${className}`.trim()}>
      <div className="section-marker__rail">
        <span className="section-marker__index">SECTION {number}</span>
        <span className="section-marker__line" />
        <span className="section-marker__title">{title}</span>
      </div>
    </div>
  );
}
