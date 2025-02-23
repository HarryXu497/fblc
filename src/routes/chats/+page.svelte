<script lang="ts">
    import { collection, onSnapshot, or, orderBy, query, where } from 'firebase/firestore';
    import { firestore } from '$lib/firebase';
    import auth from '$lib/state/auth.svelte';
    import { getPublicUser } from '$lib/utils/publicUser.svelte';
    import Metadata from '$lib/components/Metadata.svelte';
    import Window from '$lib/components/Window.svelte';

    let chats = $state<IChat[] | null>(null);

    $effect(() => {
        if (!auth || !auth.value) {
            return;
        }

        const chatRef = collection(firestore, "chats");

        const q = query(chatRef,
            or(
                where("sender", "==", auth.value.uid),
                where("receiver", "==", auth.value.uid),
            ),
            orderBy("lastMessage",  "desc"),
        )

        onSnapshot(q, async (snap) => {
            const chatDocs = await Promise.all(snap.docs.map(async chat => {
                if (!auth.value) {
                    return null;
                }

                const other = chat.get("sender") === auth.value.uid ? chat.get("receiver") : chat.get("sender");
                const userInfo = await getPublicUser(other);

                if (!userInfo) {
                    return null
                }

                return {
                    id: chat.id,
                    other: chat.get("sender"),
                    displayName: userInfo.displayName
                } as IChat
            }));

            chats = chatDocs.filter(chat => chat !== null);
        })
    })
</script>

<Metadata
    title="your chats | farmer's market"
/>

{#if chats}
    <main class="mx-auto w-[clamp(20rem,_60%,_72rem)] h-[calc(100%_-_6rem)] flex flex-col mt-4 gap-8 items-center">
        <h1 class="text-5xl">your <span class="text-accent">chats</span></h1>
        <div class="grid grid-cols-2 gap-6">
            {#each chats as chat}
                <a class="block w-full transition shadow hover:shadow-xl hover:cursor-pointer hover:-translate-y-1" href="/chats/{chat.id}">
                    <Window>
                        <p class="text-white font-bold ml-3 mr-5 px-4 py-2">your chat with <span class="text-accent">{chat.displayName.toLocaleLowerCase()}</span></p>
                    </Window>
                </a>
            {/each}
        </div>
    </main>
{:else}
    <main
    class="w-full h-[calc(100%_-_6rem)] flex flex-row items-center justify-center"
    >
        <p class="text-4xl">loading chats...</p>
    </main>
{/if}