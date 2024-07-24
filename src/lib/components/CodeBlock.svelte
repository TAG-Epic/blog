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
<style>
    .code-block {
        padding-left: .5rem;
        padding-right: .5rem;
        background: #1f1f1f;
        max-width: 100%;
        overflow-x: scroll;
    }
</style>
<div class="code-block">
    {#if renderedCodeBlock !== undefined}
        {#await renderedCodeBlock then codeHtml}
            {@html codeHtml}
        {/await}
    {/if}
</div>
