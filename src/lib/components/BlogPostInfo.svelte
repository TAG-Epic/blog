<script lang="ts">
    import type { PostMetadata } from "$lib/posts";
    export let post: PostMetadata;
</script>
<style>
    .post {
        text-decoration: none;
    }
    .post:hover > .title {
        color: #333;
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
    }
</style>
<a class="post" href={`/posts/${post.slug}/`}>
    <img class="hero" width={720} src={post.hero.image} alt="" />
    <h4 class="title">{post.title}</h4>
    <p class="date">
        {post.pubDate}
    </p>
    <div class="tags">
        {#each post.tags as tag}
            <a class="tag" href={`/tags/${tag}`}>
                #{tag}
            </a>
        {/each}
    </div>
</a>
