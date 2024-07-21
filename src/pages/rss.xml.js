import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getReleasedPosts } from "../posts";

export async function get(context) {
    const items = 
		getReleasedPosts().map((post) => ({
            title: post.title,
            description: post.description,
			link: `/posts/${post.slug}/`,
            pubDate: post.pubDate,
		}));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
        items: items
	});
}
