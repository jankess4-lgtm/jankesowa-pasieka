import Link from "next/link";

const TOKEN = /(\[[^\]]+\]\([^\)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

/** Renders [label](/internal-path) as links; other text is plain. External URLs are not linked. */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(LINK);
        if (!match) return <span key={index}>{part}</span>;
        const [, label, href] = match;
        if (!href.startsWith("/")) return <span key={index}>{label}</span>;
        return (
          <Link
            key={index}
            href={href}
            className="text-brand-gold underline underline-offset-2 hover:text-brand-brown transition-colors"
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
