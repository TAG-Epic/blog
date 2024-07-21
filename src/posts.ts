import OutdatedSoftwareRepositoriesData from "./pages/posts/outdated-software-repositories.json";
import VailCheaterboardData from "./pages/posts/vail-cheaterboard.json";
import NetworkConditionsVisualizedData from "./pages/posts/network-conditions-visualized.json";

export type PostMetadata = {
    title: string;
    description: string;
    slug: string;
    pubDate: string;
    hero: string;
    heroCredit?: string;
    tags: string[];
    released: boolean;
};
const POSTS: PostMetadata[] = [
    OutdatedSoftwareRepositoriesData,
    VailCheaterboardData,
    NetworkConditionsVisualizedData
];

export function getAllPosts(): PostMetadata[] {
    return POSTS;
}
export function getReleasedPosts(): PostMetadata[] {
    return POSTS.filter(post => post.released);
}
export function getTags(): string[] {
    return POSTS.flatMap(post => post.tags).filter((tag, index, self) => index === self.indexOf(tag));
}

