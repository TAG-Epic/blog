import { getPostBySlug } from "$lib/posts";
import { error } from '@sveltejs/kit';
// TODO: Type
export async function load(event) {
    // Get post slug
    let path = event.url.pathname;

    for (const fragment of path.split("/")) {
        let post = getPostBySlug(fragment);
        if (post === undefined) continue;

        return {
            metadata: post
        };
    }
    error(500, "page found but not post");
}
