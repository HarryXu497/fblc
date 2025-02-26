import { serverTimestamp } from "firebase/firestore";

/**
 * @param senderId the id of the message sender
 * @param senderName the name of the message sender
 * @param sentAt the datetime of the message
 * @param content the content of the message
 */
interface IMessage {
    senderId: string;
    senderName: string;
    sentAt: Date;
    content: string;
}

/**
 * @param senderId the id of the message sender
 * @param senderName the name of the message sender
 * @param sentAt the datetime of the message, as a Firebae  FieldValue sentinal value
 * @param content the content of the message
 */
interface FirebaseMessage extends Omit<IMessage, "sentAt"> {
    sentAt: ReturnType<typeof serverTimestamp>;
}

export type { IMessage, FirebaseMessage };
