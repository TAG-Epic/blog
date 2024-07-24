import type { PostMetadata } from "$lib/posts";
import HeroImage from "./assets/hardpoint-exploit-example.jpg";
export const metadata: PostMetadata = {
    title: "The VAIL Cheaterboard",
    description: "Using 67 million rows of stats to make fun of cheaters",
    slug: "vail-cheaterboard",
    pubDate: "16 Jun 2024",
    hero: {
        image: HeroImage,
        credit: "Photo by RICHDGEB. He did not wish to share his score.",
    },
    tags: ["vail"],
    released: true
}
