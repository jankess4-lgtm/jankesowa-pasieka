import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ShopReview } from "@/lib/google-reviews";

function Stars({ count = 5 }: { count?: number }) {
  const full = Math.max(0, Math.min(5, Math.round(count)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${full} na 5 gwiazdek`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < full
              ? "w-4 h-4 fill-brand-gold text-brand-gold"
              : "w-4 h-4 text-brand-creamDark"
          }
          aria-hidden
        />
      ))}
    </div>
  );
}

type Props = {
  profileUrl: string;
  reviewUrl: string;
  reviews: ShopReview[];
  /** Aggregate rating from Places (e.g. 5.0). Null = do not claim an aggregate. */
  rating?: number | null;
  /** Total Google review count from Places. Null = do not claim a count. */
  userRatingCount?: number | null;
  source?: "places" | "static";
};

function formatRatingLabel(rating: number | null | undefined, count: number | null | undefined) {
  if (typeof rating === "number" && typeof count === "number" && count > 0) {
    const r = rating.toLocaleString("pl-PL", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `${r} ★ · ${count} ${count === 1 ? "opinia" : count < 5 ? "opinie" : "opinii"} w Google`;
  }
  if (typeof rating === "number") {
    const r = rating.toLocaleString("pl-PL", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `${r} ★ · opinie z Google`;
  }
  return "opinie z Google";
}

export default function GoogleReviews({
  profileUrl,
  reviewUrl,
  reviews,
  rating = null,
  userRatingCount = null,
  source = "static",
}: Props) {
  const label = formatRatingLabel(rating, userRatingCount);

  return (
    <section id="opinie-google" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="section-divider mb-4" />
        <h2 className="font-serif text-4xl text-brand-brown tracking-tight mb-3">
          Opinie w Google
        </h2>
        <p className="inline-flex items-center justify-center gap-2 text-sm text-brand-brown/80 mb-2">
          {typeof rating === "number" ? <Stars count={rating} /> : <Stars count={5} />}
          <span className="font-medium">{label}</span>
        </p>
        <p className="text-[#374151] max-w-2xl mx-auto text-sm sm:text-base">
          {source === "places"
            ? "Opinie z naszego profilu w Google. Po zakupie możesz zostawić swoją — pomożesz innym znaleźć prawdziwy miód prosto z pasieki."
            : "Kilka ostatnich opinii z naszego profilu w Google. Po zakupie możesz zostawić swoją — pomożesz innym znaleźć prawdziwy miód prosto z pasieki."}
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {reviews.map((r) => (
          <article
            key={`${r.author}-${r.when}-${r.text.slice(0, 24)}`}
            className="shrink-0 w-[85%] max-w-sm snap-center sm:w-auto sm:max-w-none bg-white rounded-2xl border border-brand-creamDark p-5 sm:p-6 shadow-sm flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                {r.authorUri ? (
                  <a
                    href={r.authorUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-brown truncate hover:underline"
                  >
                    {r.author}
                  </a>
                ) : (
                  <div className="font-medium text-brand-brown truncate">{r.author}</div>
                )}
                {r.badge ? (
                  <div className="text-xs text-brand-brown/60 mt-0.5">{r.badge}</div>
                ) : null}
              </div>
              {r.when ? (
                <div className="text-xs text-brand-brown/50 whitespace-nowrap shrink-0">
                  {r.when}
                </div>
              ) : null}
            </div>
            <Stars count={r.rating} />
            <p className="mt-3 text-sm leading-relaxed text-[#374151] flex-1">{r.text}</p>
            <div className="mt-4 pt-3 border-t border-brand-creamDark/80 text-[11px] tracking-wide text-brand-brown/50 uppercase">
              Google
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-brand-brown/45">
        Opinie pochodzą z Google.{" "}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-brand-brown/70"
        >
          Zobacz wszystkie w Google
        </a>
        .
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Zobacz profil w Google
          </Button>
        </a>
        <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="w-full sm:w-auto">
            Zostaw opinię w Google
          </Button>
        </a>
      </div>
    </section>
  );
}
