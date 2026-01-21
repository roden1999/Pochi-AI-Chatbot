import { useState, useEffect } from 'react';

//components
import { Messages } from "../Messages/Messages";
import { Control } from "../Controls/Controls";

type ControlsProps = {
    assistant: any,
    isActive: boolean,
    chatId: string,
    chatMessages: any[],
    onChatUpdate: (id: string, message: ChatMessage[]) => void;
};

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
};

const MESSAGES: ChatMessage[] = [
    {
        role: "assistant",
        content: "Hello! I'm Pochi. How can  I assist you right now?"
    },
];

export function Chat({ assistant, isActive, chatId, chatMessages, onChatUpdate }: ControlsProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(MESSAGES);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        setMessages(chatMessages);

        if (assistant?.name === "googleai") {
            assistant.createChat(chatMessages)
        }
    }, [chatId]);

    useEffect(() => {
        onChatUpdate(chatId, messages)
    }, [messages]);

    function updateLastMessageContent(content: any) {
        setMessages(prevMessage => prevMessage.map((message, index) =>
            index === prevMessage.length - 1
                ? { ...message, content: `${message.content}${content}` }
                : message
        ));
    }

    function addMessage(message: any) {
        setMessages(prev => [...prev, message]);
    }

    async function handleSend(content: any) {
        console.log(assistant);
        setIsLoading(true);
        addMessage({ role: "user", content });
        try {
            const result = await assistant.chatStream(
                content,
                messages.filter(({ role }) => role !== "system")
            );

            var isFirstChunk = false;
            for await (const chunk of result) {
                if (!isFirstChunk) {
                    isFirstChunk = true;
                    addMessage({ role: "assistant", content: "" });
                    setIsLoading(false);
                    setIsStreaming(true);
                }

                updateLastMessageContent(chunk);
            }
            setIsStreaming(false);
        } catch (error: unknown) {
            addMessage({
                role: "system",
                content:
                    error instanceof Error
                        ? error.message
                        : "Sorry, I couldn't process your request. Please try again!",
            });
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    }

    if (!isActive) return null;

    return (
        <>
            <Messages messages={messages} isLoading={isLoading} />

            <Control
                isDisabled={isLoading || isStreaming}
                onSend={handleSend}
            />
        </>
    );
}