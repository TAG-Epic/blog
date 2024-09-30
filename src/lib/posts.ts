import { metadata as NETWORK_CONDITIONS_VISUALIZED_DATA } from "../routes/posts/network-conditions-visualized/metadata";
import { metadata as VAIL_CHEATERBOARD_METADATA } from "../routes/posts/vail-cheaterboard/metadata";
import { metadata as OUTDATED_SOFTWARE_REPOSITORIES_METADATA } from "../routes/posts/outdated-software-repositories/metadata";
import { metadata as INFORMATION_UTILITY_DISCUSSION_METADATA } from "../routes/posts/information-utility-discussion/metadata";

export type PostMetadata = {
    title: string;
    description: string;
    slug: string;
    pubDate: string;
    hero: PostMetadataHero;
    tags: string[];
    released: boolean;
};
export type PostMetadataHero = {
    image: string;
    credit: string | null;
};
const POSTS: PostMetadata[] = [
    NETWORK_CONDITIONS_VISUALIZED_DATA,
	INFORMATION_UTILITY_DISCUSSION_METADATA,
    VAIL_CHEATERBOARD_METADATA,
    OUTDATED_SOFTWARE_REPOSITORIES_METADATA,
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

export function getPostBySlug(slug: string): PostMetadata | undefined {
    return POSTS.filter(post => post.slug === slug)[0];
}

