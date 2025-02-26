<script lang="ts">
    /**
     * A component that displays an icon with @iconify/svelte,
     * with additional logic to preload icons to increase site responsiveness
    */

    import Icon, {
        iconExists,
        loadIcon,
        loadIcons,
        type IconifyIcon,
    } from "@iconify/svelte";
    import { onMount, type Snippet } from "svelte";

    /**
     * @param icon the string indicating the icon
     * @param preload a list of icons to preload (download ahead-of-time)
     * @param fallback the Snippet rendered while the icon is loading
     * @param others an object of all other props passed to the component
    */
    interface Props {
        icon: string;
        preload?: string[];
        fallback?: Snippet;
        [others: string]: any;
    }

    let {
        icon,
        preload = [],
        fallback,
        ...others
    }: Props = $props();

    // Load the icon using @iconify/svelte
    let loaded = $state<boolean>(false);
    let loadIconTask = $state<Promise<Required<IconifyIcon>> | null>(null);

    onMount(() => {
        loaded = iconExists(icon);

        loadIcons(preload);

        if (!loaded) {
            loadIconTask = loadIcon(icon);
        }
    });
</script>

{#await loadIconTask}
    {@render fallback?.()}
{:then}
    <Icon on:mouseover {icon} {...others} />
{:catch}
    {@render fallback?.()}
{/await}
