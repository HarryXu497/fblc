import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
    return {
        listingId: params.listingId,
    };
};
