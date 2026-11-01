export default function PromoSwiecie({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm text-brand-brown ${className}`}>
      <strong>Promocja dla mieszkańców Świecia i powiatu świeckiego:</strong> duży słoik miodu (1,2 kg) za 50 zł przy
      odbiorze osobistym po wcześniejszym umówieniu telefonicznym:{" "}
      <a href="tel:+48514070298" className="font-semibold underline whitespace-nowrap">+48 514 070 298</a>.
      <span className="block mt-1 text-xs text-brand-brown/70">
        Oferta dostępna tylko po umówieniu telefonicznym – nie dotyczy zamówień przez sklep internetowy.
      </span>
    </div>
  );
}
