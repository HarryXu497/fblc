<script lang="ts">
    /**
     * A page that displays all gardens owned by a user
     */

    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";
    import GardenCard from "$lib/components/GardenCard.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
    import type { Garden } from "$lib/models/Garden.model";
    import { getGardens } from "$lib/utils/garden.svelte";

    let gardens = $state<Garden[] | null>(null);

    // Gets all gardens
    $effect(() => {
        getGardens()
            .then((g) => (gardens = g))
            .catch((e) => goto("/log-in"));
    });
</script>

<Metadata title="your gardens | farmer's market" />

{#if gardens}
    {#if gardens.length === 0}
        <main
            class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
        >
            <p class="text-4xl">no gardens yet</p>
        </main>
    {:else}
        <main class="flex flex-col items-center gap-8">
            <h1 class="text-5xl font-bold">
                your <span class="text-accent">gardens</span>
            </h1>
            <section
                class="mb-8 grid w-[clamp(20rem,_80%,_96rem)] grid-cols-3 gap-8 px-8"
            >
                {#each gardens as garden}
                    <GardenCard {garden} />
                {/each}
            </section>
        </main>
    {/if}
{:else}
    <!-- Content displayed while loading the gardens -->
    <main
        class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
    >
        <p class="text-4xl">loading gardens...</p>
    </main>
{/if}

<a
    class="
        fixed right-12 bottom-12
        flex flex-row items-center gap-2 rounded-xl bg-accent px-3 py-2 text-xl
        text-white drop-shadow-xl transition-transform hover:-translate-y-1
    "
    href="{base}/gardens/new"
>
    <FallbackIcon class="font-bold text-white" icon="ri:add-line" />
    new garden
</a>
