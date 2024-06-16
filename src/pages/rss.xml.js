import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import BLOG_POSTS from "../posts.json";

export async function get(context) {
    const items = 
		Object.values(BLOG_POSTS).map((post) => ({
            title: post.title,
            description: post.description,
			link: `/posts/${post.slug}/`,
            pubDate: post['pub-date'],
		}));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
        items: items
	});
}
