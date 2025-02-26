<script lang="ts">
    /** 
     * A component that displays a garden sidebar, with a crop palette and a crop summary section
    */
    import crops from "$lib/state/crops.svelte";
    import type { Crop } from "$lib/models/Crop.model";
    import Window from "../Window.svelte";
    import type { Garden } from "$lib/models/Garden.model";
    import pluralize from "pluralize";
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";

    /**
     * @param brush the currently selected crop to plany
     * @param garden the garden providing the data for the crop summary section
    */
    interface Props {
        brush: Crop | null;
        garden: Garden;
    }

    let { brush = $bindable(), garden, }: Props = $props();

    // Counts the amount of each crop in the garden and multiplies the counts
    // by the 'density' of each crop (how many of each crop can fit in 1 square meter).
    let summary = $derived.by(() => {
        const counts = new Map<string, number>();

        for (const col of garden.tiles) {
            for (const tile of col) {
                if (tile.crop !== null) {
                    if (!counts.has(tile.crop.name)) {
                        counts.set(tile.crop.name, 0);
                    }

                    counts.set(
                        tile.crop.name,
                        counts.get(tile.crop.name)! + tile.crop.density,
                    );
                }
            }
        }

        return counts;
    });
</script>

{#snippet brushButton(crop: Crop | null)}
    <button
        onclick={() => (brush = crop)}
        class="flex flex-row items-center gap-2 text-2xl hover:cursor-pointer"
    >
        <div
            style:background-color={crop
                ? crop.color
                : "var(--color-garden-dirt)"}
            style:border-color={brush === crop ? "var(--color-accent)" : ""}
            class="aspect-square w-6 rounded-4xl border-4"
        ></div>
        <p
            class="text-white"
            style:color={brush === crop ? "var(--color-accent)" : ""}
            style:font-weight={brush === crop ? "bold" : ""}
        >
            {crop ? crop.name : "reset"}
        </p>
    </button>
{/snippet}

<section class="flex h-full flex-col gap-4">
    <div class="h-[50%] grow">
        <Window>
            {#snippet top()}
                <p class="text-white text-xl">crop palette</p>
            {/snippet}
            <div class=" ml-2.5 h-full grow rounded-sm px-4 pt-1">
                {#if crops.value}
                    {#each crops.value as crop}
                        {@render brushButton(crop)}
                    {/each}
                    {@render brushButton(null)}
                {/if}
            </div>
        </Window>
    </div>
    <div class="h-[50%] grow">
        <Window>
            {#snippet top()}
                <p class="text-white text-xl">what you need</p>
            {/snippet}
            <div class="mr-10 ml-2.5 h-full grow rounded-sm px-4 pt-1">
                {#if summary.size !== 0}
                    <div class="mr-6 flex h-full flex-col justify-between">
                        <div class="flex flex-col gap-0.5">
                            {#each summary.entries().toArray() as [crop, count]}
                                <p class="text-2xl text-white">
                                    <span class="text-accent">{count}</span>
                                    {crop}
                                    {pluralize("crop", count)}
                                </p>
                            {/each}
                        </div>
                        <a
                            href="/buy"
                            class="proceed flex flex-row gap-4 text-2xl font-bold text-accent"
                        >
                            <span>go buy</span>
                            <FallbackIcon
                                icon="ri:arrow-right-long-line"
                                preload={["ri:arrow-right-long-line"]}
                                class="mr-1 inline-block"
                            />
                        </a>
                    </div>
                {:else}
                    <p
                        class="mr-6 flex h-full flex-row items-center justify-center pb-1 text-2xl text-white"
                    >
                        plan your garden!
                    </p>
                {/if}
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
