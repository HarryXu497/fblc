<script lang="ts">
    /** 
     * A chat message component
    */
    import type { IMessage } from "$lib/models/Message.model";

    /**
     * @param message the message displayed by the component
     * @param userID the ID of the current user
     * @param collapseName if the user's name should be shown or not 
    */
    interface Props {
        message: IMessage;
        userId: string;
        collapseName?: boolean;
    }

    let { message, userId, collapseName = false, }: Props = $props();
</script>

<div
    class="flex flex-col"
    style:align-items={message.senderId === userId ? "self-end" : "self-start"}
>
    {#if !collapseName}
        <h3 class="mt-2 font-bold text-accent">{message.senderName}</h3>
    {/if}
    <p>{message.content}</p>
</div>
