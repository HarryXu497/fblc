import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { GeocodeResult } from "@googlemaps/google-maps-services-js";
import reverseGeocode from "$lib/utils/reverseGeocode";

/**
 * Handles a GET request to /geocode. Uses the Google Maps API to 
 * locate an address from its latitude and longitude
 * @param request the request data
 * @returns a response of the address
 */
export const GET: RequestHandler = async ({ url }) => {
    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));

    let address: GeocodeResult;

    try {
        address = await reverseGeocode(lat, lng)
    } catch (e) {
        if (e instanceof Error) {
            error(400, e.message);
        }

        error(400, "Something went wrong.");
    }

    return new Response(JSON.stringify(address));
};
