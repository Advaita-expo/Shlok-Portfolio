export type MediaSlot = "hero" | "intro" | "footer" | "voices" | "qsentia" | "research";

type VideoSource = {
  src: string;
  poster?: string;
  position?: string;
};

const spacecraft: VideoSource = {
  src: "assets/footer-video.mp4",
  poster: "assets/footer-video-poster.webp",
};

// Local clips are served from public/assets. Panels without clips show their artwork.
export const videos: Partial<Record<MediaSlot, VideoSource>> = {
  hero: { src: "assets/landing-hero-race-tower.mp4", poster: "assets/landing-hero-poster.webp" },
  intro: spacecraft,
  footer: spacecraft,
};

export function isMediaSlot(value: string | undefined): value is MediaSlot {
  return value === "hero" || value === "intro" || value === "footer"
    || value === "voices" || value === "qsentia" || value === "research";
}
