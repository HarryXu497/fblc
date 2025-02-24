import type { GeocodeResult } from "@googlemaps/google-maps-services-js";
import type { PageServerLoad } from "./$types";
import { getCropListing } from "$lib/utils/cropListing.svelte";
import reverseGeocode from "$lib/utils/reverseGeocode";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const listing = await getCropListing(params.listingId);

    if (!listing) {
        return {
            listingId: params.listingId,
            listing: null,
            address: null,
        };
    }

    let address: GeocodeResult;

    try {
        address = await reverseGeocode(listing.lat, listing.lng)
    } catch (e) {
        if (e instanceof Error) {
            error(400, e.message);
        }

        error(400, "Something went wrong.");
    }

    return {
        listingId: params.listingId,
        listing,
        address,
    };
};
