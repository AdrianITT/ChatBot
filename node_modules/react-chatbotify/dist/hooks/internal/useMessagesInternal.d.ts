import { Message } from "../../types/Message";
/**
 * Internal custom hook for managing sending of messages.
 */
export declare const useMessagesInternal: () => {
    simulateStreamMessage: (content: string, sender?: string, simulateStreamChunker?: ((content: string) => Array<string>) | null) => Promise<Message | null>;
    injectMessage: (content: string | JSX.Element, sender?: string) => Promise<Message | null>;
    removeMessage: (messageId: string) => Promise<Message | null>;
    streamMessage: (content: string | JSX.Element, sender?: string) => Promise<Message | null>;
    endStreamMessage: (sender?: string) => Promise<boolean>;
    replaceMessages: (newMessages: Array<Message>) => void;
    messages: Message[];
};
//# sourceMappingURL=useMessagesInternal.d.ts.map