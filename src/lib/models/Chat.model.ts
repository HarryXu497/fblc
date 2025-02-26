/**
 * @param id the chat id
 * @param other the id of the chat participant opposite the current user
 * @param displayName the name of the other participant
 */
interface IChat {
    id: string;
    other: string;
    displayName: string;
}

export type { IChat };
