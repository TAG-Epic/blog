<script lang="ts">
    import type { PostMetadata } from "$lib/posts";
    export let post: PostMetadata;
</script>
<style>
    .post {
        text-decoration: none;
		display: flex;
		flex-direction: column;
		gap: .5rem;
    }
    .post:hover > .post-details > .title {
        color: #333;
    }
	.post-details {
		display: flex;
		flex-direction: column;
	}
    .title {
        margin: 0;
        color: rgb(var(--black));
        line-height: 1;
        font-size: 2rem;
        color: black;
    }
    .date {
        margin: 0;
        color: #000;
    }
    .hero {
        border-radius: 5px;
		width: calc(min(100%, 720px));
		object-fit: cover;
		aspect-ratio: 6/4;
    }
</style>
<a class="post" href={`/posts/${post.slug}/`}>
    <img class="hero" src={post.hero.image} alt="" />
	<div class="post-details">
		<span class="title">{post.title}</span>
		<span class="date">
			{post.pubDate}
		</span>
		<div class="tags">
			{#each post.tags as tag}
				<a class="tag" href={`/tags/${tag}`}>
					#{tag}
				</a>
			{/each}
		</div>
	</div>
</a>
