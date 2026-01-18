import { useEffect, useMemo, useRef } from 'react';
import Markdown from 'react-markdown';
import styles from "./Chat.module.css";

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
};

type ChatProps = {
    messages: ChatMessage[];
};

export function Chat({ messages }: ChatProps) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesGroups = useMemo<ChatMessage[][]>(() => messages.reduce<ChatMessage[][]>((groups, message) => {
        if (message.role === 'user' || groups.length === 0) groups.push([]);
        groups[groups.length - 1].push(message);
        console.log(groups);
        return groups;
    }, []), [messages])

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "user") {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

    }, [messages])
    return (
        <div className={styles.Chat}>
            {messagesGroups.map(
                (messages, groupIndex) => (
                    // Group
                    <div key={groupIndex} className={styles.Group}>
                        {messages.map(({ role, content }, index) => (
                            // Message
                            <div key={index} className={styles.Message} data-role={role}>
                                <Markdown>{content}</Markdown>
                            </div>
                        ))}

                    </div>
                ))
            }
            <div ref={messagesEndRef} />
        </div>
    );
}