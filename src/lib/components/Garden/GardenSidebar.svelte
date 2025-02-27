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
    import type { Brush } from "./GardenDisplay.svelte";

    /**
     * @param brush the currently selected crop to plany
     * @param garden the garden providing the data for the crop summary section
     */
    interface Props {
        brush: Brush;
        garden: Garden;
    }

    let { brush = $bindable(), garden }: Props = $props();

    let selectedTipCrop = $state<Crop | null>(null);

    let closeButtonHovered = $state<boolean>(false);

    // Reset the close button hovered state if the crop is deselected
    $effect(() => {
        if (selectedTipCrop === null) {
            closeButtonHovered = false;
        }
    });

    // Keeps track of hovered buttons for icon change effect
    let hovered = $state<boolean[] | null>(null);

    $effect(() => {
        if (crops.value && selectedTipCrop === null) {
            hovered = Array(crops.value.length).fill(false);
        }
    });

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

    function computeColor(brush: Brush) {
        if (brush === null || brush === "unplanted") {
            return "var(--color-garden-dirt-darker)";
        } else if (brush === "planted") {
            return "var(--color-dark-accent)";
        } else {
            return brush.color;
        }
    }
</script>

{#snippet brushButton(crop: Brush, i: number)}
    <div class="flex flex-row gap-2">
        <button
            onclick={() => (brush = crop)}
            class="flex flex-row items-center gap-2 text-xl hover:cursor-pointer"
        >
            <div
                style:background-color={computeColor(crop)}
                style:border-color={brush === crop ? "var(--color-accent)" : ""}
                class="aspect-square w-6 rounded-4xl border-4"
            ></div>
            <p
                class="flex flex-row items-center gap-2 text-white"
                style:color={brush === crop ? "var(--color-accent)" : ""}
                style:font-weight={brush === crop ? "bold" : ""}
            >
                {#if crop === null}
                    reset
                {:else if typeof crop === "string"}
                    mark as {crop}
                {:else}
                    {crop.name}
                {/if}
            </p>
        </button>
        {#if crop && typeof crop !== "string" && hovered}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <button
                class="text-white hover:cursor-pointer"
                onmouseover={() => (hovered![i] = true)}
                onmouseleave={() => (hovered![i] = false)}
                onclick={() => (selectedTipCrop = crop)}
            >
                <FallbackIcon
                    icon="ri:information-{hovered![i] ? 'fill' : 'line'}"
                    preload={["ri:information-line", "ri:information-fill"]}
                    class="pt-1 text-2xl"
                />
            </button>
        {/if}
    </div>
{/snippet}

<section class="flex h-full flex-col gap-4">
    <div class="h-[50%] grow">
        <Window>
            {#snippet top()}
                {#if selectedTipCrop === null}
                    <p class="text-xl text-white">crop palette</p>
                {:else}
                    <div
                        class="flex w-full flex-row items-center justify-between"
                    >
                        <p class="text-xl text-white">
                            <span class="text-accent"
                                >{selectedTipCrop.name}</span
                            > tips
                        </p>
                        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                        <button
                            class="text-xl text-white hover:cursor-pointer"
                            onclick={() => (selectedTipCrop = null)}
                            onmouseover={() => (closeButtonHovered = true)}
                            onmouseleave={() => (closeButtonHovered = false)}
                        >
                            <FallbackIcon
                                icon="ri:close-circle-{closeButtonHovered
                                    ? 'fill'
                                    : 'line'}"
                                preload={[
                                    "ri:close-circle-line",
                                    "ri:close-circle-fill",
                                ]}
                            />
                        </button>
                    </div>
                {/if}
            {/snippet}
            <div class="ml-2.5 h-full grow rounded-sm px-4 pt-1">
                {#if selectedTipCrop === null}
                    {#if crops.value}
                        {#each crops.value as crop, i}
                            {@render brushButton(crop, i)}
                        {/each}
                        {@render brushButton("planted", crops.value.length)}
                        {@render brushButton("unplanted", crops.value.length + 1)}
                        {@render brushButton(null, crops.value.length + 2)}
                    {/if}
                {:else}
                    <ul class="text-md ml-0 gap-1 px-0 text-white">
                        {#each crops.getTips(selectedTipCrop.id)! as tip, i}
                            {#if i % 2 === 0}
                                <li class="text-white">{tip}</li>
                            {:else}
                                <li class="text-accent">{tip}</li>
                            {/if}
                        {/each}
                    </ul>
                {/if}
            </div>
        </Window>
    </div>
    <div class="h-[50%] grow">
        <Window>
            {#snippet top()}
                <p class="text-xl text-white">what you need</p>
            {/snippet}
            <div class="mr-10 ml-2.5 h-full grow rounded-sm px-4 pt-1">
                {#if summary.size !== 0}
                    <div class="mr-6 flex h-full flex-col justify-between">
                        <div class="flex flex-col gap-0.5">
                            {#each summary.entries().toArray() as [crop, count]}
                                <p class="text-xl text-white">
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
