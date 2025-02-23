<script lang="ts">
    import crops from '$lib/state/crops.svelte';
    import type { Crop } from '$lib/models/Crop.model';
    import Window from '../Window.svelte';
    import type { Garden } from '$lib/models/Garden.model';
    import pluralize from 'pluralize';
    import FallbackIcon from '$lib/components/FallbackIcon.svelte';

    interface Props {
        brush: Crop | null;
        garden: Garden;
    }

    let { brush = $bindable(), garden }: Props = $props();

    let summary = $derived.by(() => {
        const counts = new Map<string, number>();
        for (const col of garden.tiles) {
            for (const tile of col) {
                if (tile.crop !== null) {
                    if (!counts.has(tile.crop.name)) {
                        counts.set(tile.crop.name, 0);
                    }

                    counts.set(tile.crop.name, counts.get(tile.crop.name)! + tile.crop.density)
                }
            }
        }

        return counts;
    });
</script>

{#snippet brushButton(crop: Crop | null)}
    <button onclick={() => brush = crop} class="flex flex-row items-center gap-2 text-2xl hover:cursor-pointer">
        <div
            style:background-color={crop ? crop.color : "var(--color-garden-dirt)"}
            style:border-color={brush === crop ? "var(--color-accent)" : ""}
            class="aspect-square border-4 rounded-4xl w-6"
        >
            
        </div>
        <p
            class="text-white"
            style:color={brush === crop ? "var(--color-accent)" : ""}
            style:font-weight={brush === crop ? "bold" : ""}
        >{crop ? crop.name : "reset"}</p>
    </button>
{/snippet}

<section class="flex flex-col h-full gap-4">
    <div class="grow">
        <Window>
            {#snippet top()}
                <p class="text-white">crop palette</p>
            {/snippet}
            <div class=" w-full h-full rounded-sm px-4 pt-1 ml-2.5 grow">
                {#if crops.value}
                    {#each crops.value as crop}
                        {@render brushButton(crop)}
                    {/each}
                    {@render brushButton(null)}
                {/if}
            </div>
        </Window>
    </div>
    <div class="grow">
        <Window>
            {#snippet top()}
                <p class="text-white">what you need</p>
            {/snippet}
            <div class="w-full h-full rounded-sm px-4 pt-1 ml-2.5 mr-10 grow">
                <div class="flex flex-col justify-between h-full mr-6">
                    <div class="flex flex-col gap-0.5">
                        {#each summary.entries().toArray() as [crop, count]}
                            <p class="text-white text-2xl">{count} {crop} {pluralize("crops", count)}</p>
                        {/each}
                    </div>
                    <a href="/buy" class="proceed text-2xl text-accent flex flex-row gap-4 font-bold">
                        <span>go buy</span>
                        <FallbackIcon
                            icon="ri:arrow-right-long-line"
                            preload={["ri:arrow-right-long-line"]}
                            class="inline-block mr-1"
                        />
                    </a>
                </div>
            </div>
        </Window>
    </div>
</section>

<style>
    .proceed {
        background: linear-gradient(currentColor 0 0) bottom left/
            var(--underline-width, 0%) 0.1em no-repeat;
        display: inline-block;
        padding: 0 0 0.2em;
        text-decoration: none;
        transition: background-size 0.25s;
    }

    .proceed:hover {
        --underline-width: 100%;
    }
</style>