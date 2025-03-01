<script lang="ts">
    /**
     * A page that shows an individual chat between two users
     */

    import {
        addDoc,
        collection,
        doc,
        getDoc,
        onSnapshot,
        orderBy,
        query,
        serverTimestamp,
        Timestamp,
        updateDoc,
    } from "firebase/firestore";
    import type { PageProps } from "./$types";
    import { firestore } from "$lib/firebase";
    import type { IMessage } from "$lib/models/Message.model";
    import Chat from "$lib/components/Chat/Chat.svelte";
    import auth from "$lib/state/auth.svelte";
    import type { PublicUser } from "$lib/models/PublicUser.model";
    import { getPublicUser } from "$lib/utils/publicUser.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
    import { goto } from "$app/navigation";

    /**
     * Contains the chat ID from the URL
     */
    let { data }: PageProps = $props();

    let messages = $state<IMessage[] | null>(null);
    let text = $state<string>("");
    let other = $state<PublicUser | null>(null);

    $effect(() => {
        const messagesRef = collection(
            firestore,
            "chats",
            data.chatId,
            "messages",
        );

        // Get all chat messages ordered by sentAt
        const q = query(messagesRef, orderBy("sentAt", "asc"));

        // Attaches a snapshot listener to the chat's messages,
        // ordered by the time each message was sent at
        onSnapshot(
            q,
            (messagesDocs) => {
                messages = messagesDocs.docs
                    .map((message) => {
                        if (message.get("sentAt") === null) {
                            return null;
                        }

                        return {
                            senderId: message.get("senderId") as string,
                            senderName: message.get("senderName") as string,
                            content: message.get("content") as string,
                            sentAt: (
                                message.get("sentAt") as Timestamp
                            ).toDate(),
                        } as IMessage;
                    })
                    .filter((message) => message !== null);
            },
            async (error) => {
                // Redirect if an error occurs
                if (auth.value) {
                    await goto("/chats");
                } else {
                    await goto("/log-in");
                }
            },
        );
    });

    // Gets the public user information of the other chat participant
    $effect(() => {
        const chatDocRef = doc(firestore, "chats", data.chatId);

        getDoc(chatDocRef)
            .then((doc) => {
                if (!auth.value) {
                    return null;
                }

                let otherId: string;

                if (doc.get("sender") === auth.value.uid) {
                    otherId = doc.get("receiver");
                } else {
                    otherId = doc.get("sender");
                }

                return getPublicUser(otherId);
            })
            .then((u) => (other = u));
    });

    /**
     * Uploades a new message if it is valid
     */
    async function onSubmit() {
        if (!auth.value) {
            return;
        }

        if (!text.trim()) {
            return;
        }

        const messagesRef = collection(
            firestore,
            "chats",
            data.chatId,
            "messages",
        );
        const chatRef = doc(firestore, "chats", data.chatId);

        // Adds a new message and updates the chat document with the date
        // so chats can be ordered by recency
        await Promise.all([
            addDoc(messagesRef, {
                senderId: auth.value.uid,
                senderName: auth.value.displayName,
                content: text,
                sentAt: serverTimestamp(),
            }),
            updateDoc(chatRef, {
                lastMessage: serverTimestamp(),
            }),
        ]);

        // Reset input text content
        text = "";
    }
</script>

<Metadata
    title="chat with {other
        ? other.displayName.toLocaleLowerCase()
        : 'user'} | farmer's market"
/>

<main class="mx-auto h-[calc(100%_-_5rem_-_2rem)] w-[clamp(20rem,_60%,_72rem)]">
    {#if messages && auth.value}
        <Chat {messages} {onSubmit} userId={auth.value.uid} bind:text>
            <!-- This snippet goes in the top of the chat -->
            {#snippet chatHeader()}
                <p class="text-white">
                    your chat with <span class="text-accent"
                        >{other
                            ? other.displayName.toLocaleLowerCase()
                            : "..."}</span
                    >
                </p>
            {/snippet}
        </Chat>
    {:else}
        <!-- Content displayed while loading the chat -->
        <main
            class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
        >
            <p class="text-4xl">loading chat...</p>
        </main>
    {/if}
</main>
