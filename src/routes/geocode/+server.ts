import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Client } from '@googlemaps/google-maps-services-js';
import { PRIVATE_GOOGLE_MAPS_API_KEY } from '$env/static/private';

const client = new Client({});

export const GET: RequestHandler = async ({ url }) => {
	const lat = Number(url.searchParams.get('lat'));
	const lng = Number(url.searchParams.get('lng'));

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
        error(400, 'lat and lng must be numbers');
    }

    const latlng = { lat, lng };

    const response = await client.reverseGeocode({
        params: {
            key: PRIVATE_GOOGLE_MAPS_API_KEY,
            latlng: latlng,
        }
    })
    
    const address = response.data.results[0] || null;

    return new Response(JSON.stringify(address))
};