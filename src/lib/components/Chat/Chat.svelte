<script lang="ts">
    /**
     * A chat component for real-time one-on-one communication
     */

    import type { IMessage } from "$lib/models/Message.model";
    import Window from "$lib/components/Window.svelte";
    import Message from "$lib/components/Chat/Message.svelte";
    import FallbackIcon from "../FallbackIcon.svelte";
    import type { Snippet } from "svelte";

    /**
     * @param messages the list of message objects displayed by the chat
     * @param userID the ID of the current user
     * @param text the text content of the chat text input
     * @param onSubmit the callback function executed upon the submission of text input
     * @param chatHeader the snippet rendered in the top bar of the chat window
     */
    interface Props {
        messages: IMessage[];
        userId: string;
        text: string;
        onSubmit: (e: SubmitEvent) => void;
        chatHeader?: Snippet;
    }

    let {
        messages,
        userId,
        text = $bindable(),
        onSubmit,
        chatHeader,
    }: Props = $props();

    // State for a hover effect for the text submit button
    let outlined = $state<boolean>(true);

    // Stores the most recent message so it can be scrolled to progammatically
    let lastMessage = $state<HTMLLIElement | null>(null);

    /**
     * scrolls to the most recent chat message
     */
    const scrollToBottom = () => {
        if (!lastMessage) {
            return;
        }

        lastMessage.scrollIntoView();
    };

    // Scrolls to the most recent chat message whenever 'messages' updates
    $effect(() => {
        messages;

        scrollToBottom();
    });
</script>

<!-- Snippet to reduce HTML template duplication -->
{#snippet messageSnippet(message: IMessage, index: number)}
    {#if index >= 1}
        {@const prev = messages[index - 1].senderId === message.senderId}
        <Message {message} {userId} collapseName={prev} />
    {:else}
        <Message {message} {userId} />
    {/if}
{/snippet}

<section class="flex h-full flex-col gap-4">
    <Window top={chatHeader}>
        <ul
            class="mr-5 ml-3 grow overflow-y-scroll rounded-sm px-2 py-1 text-xl text-gray-50"
        >
            {#each messages as message, i}
                {#if i === messages.length - 1}
                    <!-- Binds the lastMessage state to the last li element -->
                    <li bind:this={lastMessage}>
                        {@render messageSnippet(message, i)}
                    </li>
                {:else}
                    <li>
                        {@render messageSnippet(message, i)}
                    </li>
                {/if}
            {/each}
        </ul>
    </Window>
    <div>
        <Window>
            <form
                class="mr-4.5 ml-3 flex flex-row gap-2 p-1 text-xl"
                onsubmit={(e) => {
                    // Call submit callback and reset text field
                    e.preventDefault();
                    onSubmit(e);
                    text = "";
                }}
            >
                <input
                    type="text"
                    class="grow px-2 text-gray-50 outline-accent focus-within:outline-2"
                    bind:value={text}
                />
                <button
                    class="px-0 py-0.5 pr-2 text-4xl text-accent hover:cursor-pointer"
                    type="submit"
                    onmouseenter={() => (outlined = false)}
                    onmouseleave={() => (outlined = true)}
                >
                    <FallbackIcon
                        icon="ri:send-plane-2-{outlined ? 'line' : 'fill'}"
                        preload={[
                            "ri:send-plane-2-line",
                            "ri:send-plane-2-fill",
                        ]}
                    />
                </button>
            </form>
        </Window>
    </div>
</section>
