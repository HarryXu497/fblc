<script lang="ts">
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

    let { data }: PageProps = $props();

    let user = $state<PublicUser | null>(null);
    let listing = $state<CropListing | null>(null);
    let location = $state<GeocodeResult | null>(null);

    $effect(() => {
        if (!listing) {
            return;
        }

        fetch(`/geocode?lat=${listing.lat}&lng=${listing.lng}`)
            .then((res) => res.json())
            .then((l) => (location = l));
    });

    $effect(() => {
        if (!listing) {
            return;
        }

        getPublicUser(listing.uid).then((u) => (user = u));
    });

    $effect(() => {
        getCropListing(data.listingId).then((l) => (listing = l));
    });

    const intl = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    });

    // TODO: use description
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
            const res = await addDoc(chatRef, {
                sender: auth.value.uid,
                receiver: listing.uid,
                lastMessage: serverTimestamp(),
            });

            await goto(`/chats/${res.id}`);
        } else {
            const res = queryResults.docs[0];

            await goto(`/chats/${res.id}`);
        }
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
                    {pluralize(listing.name, listing.quantity)} from
                    <span class="text-4xl font-bold text-accent"
                        >{location?.address_components[3].short_name.toLocaleLowerCase()}</span
                    >
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
                {#if auth.value && auth.value.uid !== listing.uid}
                    <button
                        onclick={createChat}
                        class="rounded-xl bg-accent px-5 py-1 text-xl text-white shadow transition-transform hover:-translate-y-0.5 hover:cursor-pointer"
                    >
                        chat
                    </button>
                {/if}
            </div>
        </div>
        <Carousel imageURLs={listing.imageURLs} />
    </main>
{:else}
    <main
        class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
    >
        <p>Loading listing...</p>
    </main>
{/if}
