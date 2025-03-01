<script lang="ts">
    /**
     * A page that displays a garden, crop palette, and a crop summary
     */

    import GardenDisplay, {
        type Brush,
    } from "$lib/components/Garden/GardenDisplay.svelte";
    import type { PageProps } from "./$types";
    import type { Garden } from "$lib/models/Garden.model";
    import { getGarden } from "$lib/utils/garden.svelte";
    import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
    import { firestore } from "$lib/firebase";
    import auth from "$lib/state/auth.svelte";
    import { goto } from "$app/navigation";
    import Metadata from "$lib/components/Metadata.svelte";

    /**
     * Contains the garden ID from the URL
     */
    let { data }: PageProps = $props();

    let garden = $state<Garden | null>(null);

    // Fetches the garden from the database
    $effect(() => {
        getGarden(data.gardenId)
            .then((g) => (garden = g))
            .catch((e) => goto("/gardens"));
    });

    /**
     * Updates the garden object and synchronizes the change to Firestore
     * @param x the x coordinate of the updated tile
     * @param y the y coordinate of the updated tile
     * @param brush the type of the brush that edited the tile
     */
    async function onTileUpdate(x: number, y: number, brush: Brush) {
        const userId = auth.value?.uid;

        if (!garden || !userId) {
            return;
        }

        if (Number.isNaN(x) || Number.isNaN(y)) {
            return;
        }

        const current = garden.tiles[y][x];

        if (brush === "planted") {
            if (current.crop !== null) {
                garden.tiles[y][x] = { ...current, planted: true };
            }
        } else if (brush === "unplanted") {
            if (current.crop !== null) {
                garden.tiles[y][x] = { ...current, planted: false };
            }
        } else if (brush === null) {
            garden.tiles[y][x] = { crop: null, planted: false };
        } else {
            garden.tiles[y][x] = { ...current, crop: brush };
        }

        // Persists the data to the database
        const tilesCollectionRef = collection(
            firestore,
            "gardens",
            userId,
            "gardens",
            garden.id,
            "tiles",
        );

        const tileDocRef = doc(tilesCollectionRef, `${x},${y}`);

        if (brush !== null) {
            await setDoc(tileDocRef, {
                ...garden.tiles[y][x].crop,
                planted: garden.tiles[y][x].planted,
            });
        } else {
            // Removes the tile document if the tile has no crop
            await deleteDoc(tileDocRef);
        }
    }

    /**
     * Deletes the garden
     */
    async function onDeleteGarden() {
        if (!garden || !auth.value) {
            return;
        }

        const gardenDocRef = doc(
            firestore,
            "gardens",
            auth.value.uid,
            "gardens",
            garden.id,
        );

        await deleteDoc(gardenDocRef);
        await goto("/gardens");
    }
</script>

<Metadata
    title="{garden
        ? garden.name.toLocaleLowerCase()
        : 'garden'} | farmer's market"
/>

{#if garden}
    <GardenDisplay {garden} {onTileUpdate} {onDeleteGarden} />
{:else}
    <!-- Content displayed while loading the garden -->
    <main
        class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
    >
        <p class="text-4xl">loading garden...</p>
    </main>
{/if}
