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
        odbiór osobisty 0 zł. <span className="font-medium">Darmowa wysyłka od 110 zł</span> wartości produktów.
      </p>
      {!compact && (
        <p className="mt-1.5 text-xs text-brand-brown/70 leading-relaxed">
          W zestawie dwóch dużych słoików (95 zł) do darmowej wysyłki brakuje 15 zł.
          W zestawie trzech małych (80 zł) wysyłka kosztuje tyle samo co za jeden słoik —
          do darmowej brakuje wtedy 30 zł.
        </p>
      )}
    </div>
  );
}
