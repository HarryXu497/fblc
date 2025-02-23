<script lang="ts">
    import type { IMessage } from "$lib/models/Message.model";
    import Window from "$lib/components/Window.svelte";
    import Message from "$lib/components/Chat/Message.svelte";
    import FallbackIcon from "../FallbackIcon.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        messages: IMessage[];
        userId: string;
        text: string;
        onSubmit: (e: SubmitEvent) => void;
        chatHeader?: Snippet;
    }

    let { messages, userId, text = $bindable(), onSubmit, chatHeader }: Props = $props();

    let outlined = $state<boolean>(true);
    let lastMessage = $state<HTMLLIElement | null>(null);

    const scrollToBottom = () => {
		if (!lastMessage) {
			return;
		}

		lastMessage.scrollIntoView();
	}

    $effect(() => {
        messages;

        scrollToBottom();
    })
</script>

<section class="flex flex-col gap-4 h-full">
    <Window top={chatHeader}>
        <ul class="grow overflow-y-scroll rounded-sm px-2 py-1 text-xl ml-3 mr-5 text-gray-50">
            {#each messages as message, i}
            {#if i === messages.length - 1}
                <li bind:this={lastMessage}>
                    {#if i >= 1}
                        {@const prev = messages[i - 1].senderId === message.senderId}
                        <Message message={message} userId={userId} collapseName={prev}/>
                    {:else}
                        <Message message={message} userId={userId}/>
                    {/if}
                </li>
            {:else}
            <li>
                {#if i >= 1}
                    {@const prev = messages[i - 1].senderId === message.senderId}
                    <Message message={message} userId={userId} collapseName={prev}/>
                {:else}
                    <Message message={message} userId={userId}/>
                {/if}
            </li>
            {/if}
            {/each}
        </ul>
    </Window>
    <div>
        <Window>
            <form class="flex flex-row text-xl ml-3 mr-4.5 p-1 gap-2" onsubmit={e => {
                    e.preventDefault()
                    onSubmit(e);
                }}>
                <input type="text" class="grow focus-within:outline-2 px-2 text-gray-50 outline-accent" bind:value={text}>
                <button
                    class="px-0 py-0.5 hover:cursor-pointer text-4xl pr-2 text-accent"
                    type="reset"
                    onmouseenter={() => outlined = false}
                    onmouseleave={() => outlined = true}
                >
                    <FallbackIcon
                        icon="ri:send-plane-2-{outlined ? 'line' : 'fill'}"
                        preload={["ri:send-plane-2-line", "ri:send-plane-2-fill"]}
                    />
                </button>
            </form>
        </Window>
    </div>
</section>