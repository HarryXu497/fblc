<script lang="ts">
    import { base } from "$app/paths";
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";
    import GardenCard from "$lib/components/GardenCard.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
    import type { Garden } from "$lib/models/Garden.model";
    import { getGardens } from "$lib/utils/garden.svelte";

    let gardens = $state<Garden[] | null>(null);

    $effect(() => {
        getGardens().then((g) => (gardens = g));
    });
</script>

<Metadata
    title="your gardens | farmer's market"
/>

{#if gardens}
    {#if gardens.length === 0}
        <main
            class="w-full h-[calc(100%_-_6rem)] flex flex-row items-center justify-center"
        >
            <p class="text-4xl">no gardens yet</p>
        </main>
    {:else}
        <main class="flex flex-col items-center gap-8">
            <h1 class="text-5xl font-bold">
                your <span class="text-accent">gardens</span>
            </h1>
            <section
                class="grid grid-cols-3 px-8 w-[clamp(20rem,_80%,_96rem)] gap-8 mb-8"
            >
                {#each gardens as garden}
                    <GardenCard {garden} />
                {/each}
            </section>
        </main>
    {/if}
{:else}
    <main
        class="w-full h-[calc(100%_-_6rem)] flex flex-row items-center justify-center"
    >
        <p class="text-4xl">loading gardens...</p>
    </main>
{/if}

<a
    class="
        rounded-xl bg-accent hover:-translate-y-1
        transition-transform text-xl text-white px-3 py-2 drop-shadow-xl fixed right-12 bottom-12
        flex flex-row items-center gap-2
    "
    href="{base}/new-garden"
>
    <FallbackIcon class="text-white font-bold" icon="ri:add-line" />
    new garden
</a>
