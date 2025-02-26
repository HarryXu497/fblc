import type { PageServerLoad } from "./$types";

/**
 * Gets the chat ID from the URL and passes it to the +page.svelte component
 */
export const load: PageServerLoad = ({ params }) => {
    return {
        chatId: params.chatId,
    };
};
