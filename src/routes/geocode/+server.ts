import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Client, type GeocodeResult } from "@googlemaps/google-maps-services-js";
import reverseGeocode from "$lib/utils/reverseGeocode";

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
