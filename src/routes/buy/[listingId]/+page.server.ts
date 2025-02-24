import { Client } from "@googlemaps/google-maps-services-js";
import type { PageServerLoad } from "./$types";
import { getCropListing } from "$lib/utils/cropListing.svelte";
import { PRIVATE_GOOGLE_MAPS_API_KEY } from "$env/static/private";

export const load: PageServerLoad = async ({ params }) => {
    const listing = await getCropListing(params.listingId);

    if (!listing) {
        return {
            listingId: params.listingId,
            listing: null,
            address: null,
        };
    }

    const client = new Client({});

    const latlng = {
        lat: listing.lat,
        lng: listing.lng,
    };

    const response = await client.reverseGeocode({
        params: {
            key: PRIVATE_GOOGLE_MAPS_API_KEY,
            latlng: latlng,
        },
    });

    const address = response.data.results[0] || null;

    return {
        listingId: params.listingId,
        listing,
        address,
    };
};
