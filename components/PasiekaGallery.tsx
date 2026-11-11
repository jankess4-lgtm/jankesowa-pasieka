import Image from "next/image";
import { pasiekaPhotos } from "@/lib/pasieka-photos";

export default function PasiekaGallery({
  heading = true,
}: {
  heading?: boolean;
}) {
  return (
    <section
      className="bg-[#F5EDE4] py-14 border-y border-brand-brown/10"
      aria-labelledby={heading ? "z-naszej-pasieki" : undefined}
    >
      <div className="max-w-6xl mx-auto px-6">
        {heading && (
          <div className="text-center mb-10">
            <div className="section-divider mb-4" />
            <h2
              id="z-naszej-pasieki"
              className="font-serif text-4xl text-brand-brown tracking-tight"
            >
              Z naszej pasieki
            </h2>
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pasiekaPhotos.map((photo) => (
            <li key={photo.src}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-creamDark">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    quality={75}
                  />
                </div>
                <figcaption className="mt-3 text-sm text-brand-brown/80 leading-snug">
                  {photo.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
