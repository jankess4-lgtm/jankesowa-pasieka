/** Mała flaga Niemiec (czarny–czerwony–złoty) jako inline SVG. */
export default function GermanFlag({
  className = "w-7 h-[17px]",
  title = "Flaga Niemiec",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 5 3"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <rect width="5" height="1" y="0" fill="#000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  );
}
