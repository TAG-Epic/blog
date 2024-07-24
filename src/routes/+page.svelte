<script lang="ts">
    import { getReleasedPosts } from "$lib/posts";
    import BlogPostInfo from "$lib/components/BlogPostInfo.svelte";
</script>

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
