import { PRIVATE_GOOGLE_MAPS_API_KEY } from "$env/static/private";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

async function reverseGeocode(lat: number, lng: number) {
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
        throw Error("lat and lng must be numbers");
    }

    const latlng = { lat, lng };

    const response = await client.reverseGeocode({
        params: {
            key: PRIVATE_GOOGLE_MAPS_API_KEY,
            latlng: latlng,
        },
    });

    return response.data.results[0] || null;
}

export default reverseGeocode;