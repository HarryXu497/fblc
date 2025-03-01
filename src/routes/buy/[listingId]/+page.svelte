<script lang="ts">
    /**
     * A page that displays information about a specific listing
     */

    import Carousel from "$lib/components/Carousel.svelte";
    import type { CropListing } from "$lib/models/CropListing.model";
    import type { PublicUser } from "$lib/models/PublicUser.model";
    import auth from "$lib/state/auth.svelte";
    import { getCropListing } from "$lib/utils/cropListing.svelte";
    import { getPublicUser } from "$lib/utils/publicUser.svelte";
    import {
        addDoc,
        and,
        collection,
        deleteDoc,
        doc,
        getDocs,
        or,
        query,
        serverTimestamp,
        where,
    } from "firebase/firestore";
    import type { PageProps } from "./$types";
    import type { GeocodeResult } from "@googlemaps/google-maps-services-js";
    import pluralize from "pluralize";
    import { firestore } from "$lib/firebase";
    import { goto } from "$app/navigation";
    import Metadata from "$lib/components/Metadata.svelte";

    /**
     * Contains the listing ID from the URL
     */
    let { data }: PageProps = $props();

    let user = $state<PublicUser | null>(null);
    let listing = $state<CropListing | null>(null);
    let location = $state<GeocodeResult | null>(null);

    // Fetches the location of the listing with reverse geocoding
    $effect(() => {
        if (!listing) {
            return;
        }

        fetch(`/geocode?lat=${listing.lat}&lng=${listing.lng}`)
            .then((res) => res.json())
            .then((l) => (location = l));
    });

    // Gets the public user information of the listing owner
    $effect(() => {
        if (!listing) {
            return;
        }

        getPublicUser(listing.uid).then((u) => (user = u));
    });

    // Gets the crop listing with the associated listing ID
    $effect(() => {
        getCropListing(data.listingId)
            .then((l) => (listing = l))
            .catch((e) => goto("/buy"));
    });

    /**
     * creates a chat within Firestore and redirects the user to the chat URL
     */
    async function createChat() {
        if (!auth || !auth.value || !listing) {
            return;
        }

        const chatRef = collection(firestore, "chats");

        // Finds chat doc if it exist and directs there, otherwise creates a new doc
        const q = query(
            chatRef,
            or(
                and(
                    where("sender", "==", auth.value.uid),
                    where("receiver", "==", listing.uid),
                ),
                and(
                    where("sender", "==", auth.value.uid),
                    where("receiver", "==", listing.uid),
                ),
            ),
        );

        const queryResults = await getDocs(q);

        if (queryResults.empty) {
            // Creates new chat documnet
            const res = await addDoc(chatRef, {
                sender: auth.value.uid,
                receiver: listing.uid,
                lastMessage: serverTimestamp(),
            });

            await goto(`/chats/${res.id}`);
        } else {
            // Goes to existing chat document
            const res = queryResults.docs[0];

            await goto(`/chats/${res.id}`);
        }
    }

    /**
     * Deletes the listing
     */
    async function onDeleteListing() {
        if (!listing || !auth.value) {
            return;
        }

        const listingDocRef = doc(firestore, "seeds", listing.id);

        await deleteDoc(listingDocRef);

        await goto("/buy");
    }

    // Currency formatter
    const intl = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    });

    /**
     * Computes name of the locality containing the address
     * @param res the reverse geocoding result
     */
    function computeLocality(res: GeocodeResult) {
        const locality =
            res?.address_components.find((l) =>
                l.types.some((g) => g === "locality"),
            ) || res?.address_components[0];

        return locality?.short_name.toLocaleLowerCase();
    }
</script>

<Metadata
    title="buy {listing
        ? pluralize(listing.name, listing.quantity)
        : 'crops'} | farmer's market"
/>

{#if listing && user}
    <main
        class="mx-auto flex h-[calc(100%_-_6rem)] w-[clamp(20rem,_60%,_72rem)] flex-col gap-3"
    >
        <div class="flex flex-col gap-2">
            <div class="flex flex-row items-center justify-between">
                <h1 class="text-4xl font-bold">
                    {pluralize(
                        `${listing.name.toLocaleLowerCase()} ${listing.type.toLocaleLowerCase()}`,
                        listing.quantity,
                    )} from
                    <span class="text-4xl font-bold text-accent">
                        {#if location}
                            {computeLocality(location)}
                        {:else}
                            ...
                        {/if}
                    </span>
                </h1>
                <h2 class="text-4xl font-bold">
                    {listing.quantity} for {intl.format(listing.price)}
                </h2>
            </div>
            <div class="flex flex-row items-center justify-between">
                <h2 class="text-2xl lowercase">
                    listed by <span class="text-accent"
                        >{user.displayName || "Unknown"}</span
                    >
                </h2>
                {#if auth.value}
                    {#if auth.value.uid !== listing.uid}
                        <button
                            onclick={createChat}
                            class="rounded-xl bg-accent px-5 py-1 text-xl text-white shadow transition-transform hover:-translate-y-0.5 hover:cursor-pointer"
                        >
                            chat
                        </button>
                    {:else}
                        <div class="flex flex-row items-center gap-2">
                            <a
                                class="rounded-sm bg-blue-700 px-3 py-1 text-xl text-white hover:cursor-pointer hover:bg-blue-800"
                                href="/buy/{listing.id}/edit"
                            >
                                edit
                            </a>
                            <button
                                class="rounded-sm bg-red-700 px-3 py-1 text-xl text-white hover:cursor-pointer hover:bg-red-800"
                                onclick={onDeleteListing}
                            >
                                delete
                            </button>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
        <Carousel imageURLs={listing.imageURLs} />
        <div class="mt-2">
            <h2 class="text-3xl text-accent">more information</h2>
            <p class="text text-lg">
                {listing.description}
            </p>
        </div>
    </main>
{:else}
    <!-- Content displayed while loading the listing -->
    <main
        class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
    >
        <p class="text-4xl">loading listing...</p>
    </main>
{/if}
