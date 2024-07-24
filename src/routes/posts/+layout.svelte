<script lang="ts">
    import type { PostMetadata } from "$lib/posts";
    type LoadData = {
        metadata: PostMetadata
    };
    export let data: LoadData;
</script>
<svelte:head>
    <title>{data.metadata.title}</title>
    <meta property="og:title" content={data.metadata.title} />
    <meta property="og:description" content={data.metadata.description} />
    <meta property="og:image" content={data.metadata.hero.image} />
</svelte:head>
<style>
    .post-container {
        display: flex;
        justify-content: center;
    }
    .post {
        width: 1200px;
        max-width: calc(100% - 2em);
        padding: 1rem;
    }
    .title {
        font-size: 3rem;
    }
    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .hero {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .hero-image {
        display: block;
        border-radius: 12px;

        height: auto;
        width: auto;

        max-width: 100%;
        max-height: 80vh;
    }
    hr {
        width: 100%;
    }
</style>

<div class="post-container">
    <div class="post">
        <div class="header">
            <div class="hero">
                <img class="hero-image" src={data.metadata.hero.image} alt="" />
                {#if data.metadata.hero.credit}
                    <cite>{data.metadata.hero.credit}</cite>
                {/if}
            </div>
            <p class="published-date">{data.metadata.pubDate}</p>
            <h1 class="title">{data.metadata.title}</h1>
            <hr/>
        </div>
        <article>
            <slot />
        </article>
    </div>
</div>
