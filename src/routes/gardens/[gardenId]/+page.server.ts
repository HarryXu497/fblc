import type { PageServerLoad } from "./$types";

/**
 * Gets garden ID from the URL and passes it to the +page.svelte component
 */
export const load: PageServerLoad = ({ params }) => {
    return {
        gardenId: params.gardenId,
    };
};
