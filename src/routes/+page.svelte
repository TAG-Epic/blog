<script lang="ts">
    import { getReleasedPosts } from "$lib/posts";
    import BlogPostInfo from "$lib/components/BlogPostInfo.svelte";
</script>

<svelte:head>
    <title>Farfrom blog</title>
    <meta property="og:title" content="blog.farfrom.world" />
    <meta property="og:description" content="Weird visualizations and longer posts" />
</svelte:head>

<style>
    .posts {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        gap: 1rem;
    }
</style>

<div class="posts">
    {#each getReleasedPosts() as post}
        <BlogPostInfo post={post} />
    {/each}
</div>
