import { getReleasedPosts } from "$lib/posts";
import { error } from '@sveltejs/kit';

export async function load(event) {
    let tag = event.params.tag;

    let posts = getReleasedPosts().filter(post => post.tags.includes(tag));
    if (posts.length === 0) {
        error(404, "tag not found");
    }
    return {
        posts
    }
}
