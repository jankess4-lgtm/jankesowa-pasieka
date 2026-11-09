/**
 * Server-only Google Places API (New) Place Details helper.
 * Uses GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID. Never import this from a Client Component.
 */

export type ShopReview = {
  author: string;
  badge?: string;
  text: string;
  when: string;
  rating: number;
  authorUri?: string;
};

export type GoogleReviewsPayload = {
  source: "places" | "static";
  rating: number | null;
  userRatingCount: number | null;
  reviews: ShopReview[];
};

/** Exact wording from Google screenshots (fallback when API key/ID missing or call fails). */
export const STATIC_GOOGLE_REVIEWS: ShopReview[] = [
  {
    author: "A.",
    badge: "Lokalny przewodnik",
    text: "Pyszny miodek, zakupiłam mniszkowo-rzepakowy i akacjowy. Napewno tu wrócę. 😋🍯🐝",
    when: "tydzień temu",
    rating: 5,
  },
  {
    author: "Iwona K.",
    text: "Miodek palce lizać 😁 Polecam serdecznie 😍",
    when: "tydzień temu",
    rating: 5,
  },
  {
    author: "J.",
    text: "Smaczny, aromatyczny i zdrowy.",
    when: "tydzień temu",
    rating: 5,
  },
];

type PlacesReview = {
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlaceDetailsResponse = {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
  error?: { message?: string; status?: string };
};

/** "Iwona Kowalska" -> "Iwona K."; "A." / "J." stay as-is. */
export function shortenAuthorDisplayName(name: string): string {
  const cleaned = name.trim().replace(/\s+/g, " ");
  if (!cleaned) return "Klient Google";
  const parts = cleaned.split(" ");
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const last = parts[parts.length - 1];
  const initial = last.replace(/[^A-Za-zÀ-žĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "").charAt(0);
  if (!initial) return first;
  return `${first} ${initial.toUpperCase()}.`;
}

function mapPlacesReview(r: PlacesReview): ShopReview | null {
  const rating = typeof r.rating === "number" ? r.rating : 0;
  if (rating < 4) return null;
  const text =
    r.text?.text?.trim() ||
    r.originalText?.text?.trim() ||
    "";
  if (!text) return null;
  const rawAuthor = r.authorAttribution?.displayName?.trim() || "Klient Google";
  return {
    author: shortenAuthorDisplayName(rawAuthor),
    text,
    when: r.relativePublishTimeDescription?.trim() || "",
    rating,
    authorUri: r.authorAttribution?.uri,
  };
}

function staticPayload(): GoogleReviewsPayload {
  return {
    source: "static",
    rating: 5,
    userRatingCount: null,
    reviews: STATIC_GOOGLE_REVIEWS,
  };
}

/**
 * Fetches Place Details (New) with rating, userRatingCount, reviews.
 * Cached/revalidated once per day. Falls back to static reviews on any failure.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsPayload> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId) {
    return staticPayload();
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pl`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error("[google-reviews] Place Details HTTP", res.status, await res.text().catch(() => ""));
      return staticPayload();
    }

    const data = (await res.json()) as PlaceDetailsResponse;
    if (data.error) {
      console.error("[google-reviews] Place Details error", data.error);
      return staticPayload();
    }

    const mapped = (data.reviews || [])
      .map(mapPlacesReview)
      .filter((r): r is ShopReview => r !== null);

    if (mapped.length === 0) {
      return staticPayload();
    }

    return {
      source: "places",
      rating: typeof data.rating === "number" ? data.rating : null,
      userRatingCount:
        typeof data.userRatingCount === "number" ? data.userRatingCount : null,
      reviews: mapped,
    };
  } catch (err) {
    console.error("[google-reviews] fetch failed", err);
    return staticPayload();
  }
}
