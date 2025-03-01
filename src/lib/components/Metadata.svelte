<script lang="ts">
    /**
     * A component that sets metadata tags in the web page for better search engine performance
     */

    import { dev } from "$app/environment";
    import type { Snippet } from "svelte";

    /**
     * @param title the title of the web page
     * @param description the description of the web page
     * @param url the url of the web page
     * @param children a snippet containing further web page metadata
     */
    interface Props {
        title: string;
        description?: string;
        url?: string;
        children?: Snippet;
    }

    let { title, description, url, children }: Props = $props();
</script>

<svelte:head>
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />

    {#if description}
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
    {/if}

    {#if url && !dev}
        <meta property="og:url" content={url} />
    {/if}

    {@render children?.()}
</svelte:head>
