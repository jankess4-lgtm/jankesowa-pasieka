export default function ShippingNote({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-brand-brown/10 bg-white px-4 py-3 text-sm text-brand-brown ${className}`}
    >
      <p className={compact ? "leading-snug" : "leading-relaxed"}>
        <span className="font-medium">Dostawa:</span> paczkomat 14 zł · kurier 16 zł ·
        odbiór osobisty 0 zł. <span className="font-medium">Darmowa wysyłka od 110 zł</span> wartości produktów (w Polsce).
        Wysyłka do Niemiec: 80 zł.
      </p>
      {!compact && (
        <p className="mt-1.5 text-xs text-brand-brown/70 leading-relaxed">
          W zestawie trzech dużych słoików (135 zł zamiast 150 zł) wysyłka jest już darmowa.
          W zestawie dwóch dużych (95 zł) do darmowej wysyłki brakuje 15 zł.
          W zestawie trzech małych (80 zł) do darmowej brakuje 30 zł.
        </p>
      )}
    </div>
  );
}
