<script lang="ts">
    import { codeToHtml } from 'shiki';
    import type { BundledLanguage } from "shiki";

    export let code: string;
    export let language: BundledLanguage;

    let renderedCodeBlock: Promise<string> | undefined = undefined;
    $: renderedCodeBlock = codeToHtml(code, {
        lang: language,
        theme: "min-dark"
    });
</script>
{#if renderedCodeBlock !== undefined}
    {#await renderedCodeBlock then codeHtml}
        <svelte:element this={codeHtml} />
    {/await}
{/if}
