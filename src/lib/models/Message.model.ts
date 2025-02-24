import { serverTimestamp } from "firebase/firestore";

interface IMessage {
    senderId: string;
    senderName: string;
    sentAt: Date;
    content: string;
}

interface FirebaseMessage {
    senderId: string;
    senderName: string;
    sentAt: ReturnType<typeof serverTimestamp>;
    content: string;
}

export type { IMessage, FirebaseMessage };
