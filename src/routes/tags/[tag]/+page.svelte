<script lang="ts">
    import type { PostMetadata } from "$lib/posts";
    import BlogPostInfo from "$lib/components/BlogPostInfo.svelte";

    type LoadData = {
        posts: PostMetadata[]
    };
    export let data: LoadData;
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
    {#each data.posts as post}
        <BlogPostInfo post={post} />
    {/each}
</div>
