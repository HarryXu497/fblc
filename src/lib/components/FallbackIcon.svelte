<script lang="ts">
	import Icon, { iconExists, loadIcon, loadIcons, type IconifyIcon } from '@iconify/svelte';
	import { onMount, type Snippet } from 'svelte';

    interface Props {
        icon: string;
        loaded?: boolean;
        preload?: string[];
        fallback?: Snippet;
        [key: string]: any;
    }

    let { icon, loaded = false, preload = [], fallback, ...others }: Props = $props()

	let loadIconTask = $state<Promise<Required<IconifyIcon>> | null>(null);

	onMount(() => {
		loaded = iconExists(icon);
		
		loadIcons(preload)

		if (!loaded) {
			loadIconTask = loadIcon(icon)
		}
	})
</script>

{#await loadIconTask}
	{@render fallback?.()}
{:then}
	<Icon on:mouseover {icon} {...others} />
{:catch}
    {@render fallback?.()}
{/await}