<script lang="ts">
    import crops from '$lib/state/crops.svelte';
    import type { Crop } from '$lib/models/Crop.model';
    import Window from '../Window.svelte';
    

    interface Props {
        brush: Crop | null;
    }

    let { brush = $bindable() }: Props = $props();
</script>

{#snippet brushButton(crop: Crop | null)}
    <button onclick={() => brush = crop} class="flex flex-row items-center gap-2 text-3xl">
        <div
            style:background-color={crop ? crop.color : "var(--color-garden-dirt)"}
            style:border-color={brush === crop ? "var(--color-accent)" : ""}
            class="aspect-square border-4 rounded-4xl w-6 "
        >
            
        </div>
        <p
            class="text-white"
            style:color={brush === crop ? "var(--color-accent)" : ""}
            style:font-weight={brush === crop ? "bold" : ""}
        >{crop ? crop.name : "reset"}</p>
    </button>
{/snippet}

<Window>
<section class=" w-full h-full rounded-sm p-4 mt-10 ml-2.5">
    {#if crops.value}
        {#each crops.value as crop}
            {@render brushButton(crop)}
        {/each}
        {@render brushButton(null)}
    {/if}
</section>
</Window>