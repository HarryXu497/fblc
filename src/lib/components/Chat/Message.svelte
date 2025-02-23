<script lang="ts">
    import type { IMessage } from "$lib/models/Message.model";

    interface Props {
        message: IMessage;
        userId: string;
        collapseName?: boolean;
    }

    let { message, userId, collapseName = false }: Props = $props();
</script>

<div
    class="flex flex-col"
    style:align-items={message.senderId === userId ? "self-end" : "self-start"}
>
    {#if !collapseName}
        <h3 class="font-bold mt-2 text-accent">{message.senderName}</h3>
    {/if}
    <p>{message.content}</p>
</div>