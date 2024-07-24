import type { PostMetadata } from "$lib/posts";
import HeroImage from "./assets/hero.jpg";
export const metadata: PostMetadata = {
    title: "How outdated are software repositories?",
    description: "",
    slug: "outdated-software-repositories",
    pubDate: "24 Aug 2023",
    hero: {
        image: HeroImage,
        credit: "Photo from Astro default blog template"
    },
    tags: ["linux", "packaging"],
    released: true
}
