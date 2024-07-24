import type { PostMetadata } from "$lib/posts";
import HeroImage from "./assets/hero.jpg";
export const metadata: PostMetadata = {
    title: "Network conditions visualized",
    description: "How different network conditions affect your gameplay",
    slug: "network-conditions-visualized",
    pubDate: "Jul 24 2024",
    hero: {
        image: HeroImage,
        credit: "Photo from Astro default blog template"
    },
    tags: ["networking", "vailvr"],
    released: true
}
