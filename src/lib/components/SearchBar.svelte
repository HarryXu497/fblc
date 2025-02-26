<script module lang="ts">
    /**
     * @param query the text query of a search
     * @param crop the crop type of a search
     * @param distance the maximum distance between the user and a crop listing location
     */
    interface SearchValues {
        query: string | null;
        crop: Crop | null;
        distance: number | null;
    }

    export type { SearchValues };
</script>

<script lang="ts">
    import type { Crop } from "$lib/models/Crop.model";
    import crops from "$lib/state/crops.svelte";
    import FallbackIcon from "./FallbackIcon.svelte";

    /**
     * @param onSearch the callback function executed when the user submits their serach query
     */
    interface Props {
        onSearch: (values: SearchValues) => void;
    }

    let { onSearch }: Props = $props();

    // Search input values
    let query = $state<string | null>(null);
    let crop = $state<Crop | null>(null);
    let distance = $state<number | null>(null);

    /**
     * Event listener for the 'submit' event of the search bar
     * @param e the submit event
     */
    function onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const values: SearchValues = {
            query: query?.trim() || null,
            crop: crop,
            distance: distance,
        };

        onSearch(values);
    }
</script>

<form
    class="relative flex h-full w-full flex-row items-center gap-3 rounded-md bg-light-accent px-4 py-3 shadow-md outline-accent outline-none focus-within:outline-2"
    onsubmit={onSubmit}
>
    <button type="submit" class="hover:cursor-pointer">
        <FallbackIcon
            class="text-2xl"
            icon="ri:search-line"
            preload={["ri:search-line"]}
        />
    </button>
    <div class="flex grow flex-row gap-2">
        <input
            type="text"
            id="search"
            class="w-full grow-4 rounded-md bg-light-accent outline-none placeholder:text-gray-500"
            placeholder="search"
            bind:value={query}
        />
        <div class="w-[2px] rounded-4xl bg-accent"></div>
        <input
            type="number"
            placeholder="distance"
            class="shrink grow placeholder:text-gray-500"
            bind:value={distance}
        />
        <div class="w-[2px] rounded-4xl bg-accent"></div>
        <select
            bind:value={crop}
            style:color={crop === null ? "var(--color-gray-500)" : ""}
            class="shrink grow"
        >
            <option value={null}>crop</option>
            {#if crops.value !== null}
                {#each crops.value as crop}
                    <option value={crop}>{crop.name}</option>
                {/each}
            {/if}
        </select>
    </div>
</form>
