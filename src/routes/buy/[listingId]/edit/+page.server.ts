import type { PageServerLoad } from "./$types";

/**
 * Gets listing ID from the URL and passes it to the +page.svelte component
 */
export const load: PageServerLoad = ({ params }) => {
    return {
        listingId: params.listingId,
    };
};
