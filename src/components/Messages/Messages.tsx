import { useEffect, useMemo, useRef } from 'react';
import { Box, useTheme } from "@mui/material";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

//components
import { Loader } from '../Loader/Loader';

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
};

type ChatProps = {
    messages: ChatMessage[];
    isLoading?: boolean;
};

export function Messages({ messages, isLoading }: ChatProps) {
    const theme = useTheme();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messagesGroups = useMemo<ChatMessage[][]>(() =>
        messages.reduce<ChatMessage[][]>((groups, message) => {
            if (message.role === 'user' || groups.length === 0) groups.push([]);
            groups[groups.length - 1].push(message);
            return groups;
        }, []),
        [messages]
    );

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "user") {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                bgcolor: theme.palette.background.default,
            }}
        >
            {messagesGroups.map((messages, groupIndex) => (
                <Box key={groupIndex} sx={{ py: 2 }}>
                    {messages.map(({ role, content }, index) => (
                        <Box
                            key={index}
                            sx={{
                                maxWidth: 900,
                                mx: "auto",
                                px: 2,
                                display: "flex",
                                justifyContent:
                                    role === "user"
                                        ? "flex-end"
                                        : role === "system"
                                            ? "center"
                                            : "flex-start",
                                mb: 1.5,
                            }}
                        >
                            {/* ASSISTANT — LEFT */}
                            {role === "assistant" && (
                                <Box
                                    sx={{
                                        maxWidth: "100%",
                                        fontSize: 15,
                                        lineHeight: 1.75,
                                        color: theme.palette.text.primary,

                                        "& p": { mt: 0, mb: 1.5 },

                                        "& pre": {
                                            bgcolor: theme.palette.mode === "dark"
                                                ? "#0d1117"
                                                : "#111827",
                                            color: "white",
                                            p: 2,
                                            borderRadius: 2,
                                            overflowX: "auto",
                                            fontSize: 14,
                                        },

                                        "& code": {
                                            fontFamily: "monospace",
                                            fontSize: 14,
                                        },
                                    }}
                                >
                                    <Markdown remarkPlugins={[remarkGfm]}>
                                        {content}
                                    </Markdown>
                                </Box>
                            )}

                            {/* USER — RIGHT, ORANGE BUBBLE */}
                            {role === "user" && (
                                <Box
                                    sx={{
                                        maxWidth: "70%",
                                        bgcolor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        px: 2,
                                        py: 1.25,
                                        borderRadius: "16px 16px 4px 16px",
                                        fontSize: 15,
                                        lineHeight: 1.6,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",

                                        "& p": { m: 0 },

                                        "& code": {
                                            fontFamily: "monospace",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            px: 0.5,
                                            borderRadius: 0.5,
                                        },
                                    }}
                                >
                                    <Markdown remarkPlugins={[remarkGfm]}>
                                        {content}
                                    </Markdown>
                                </Box>
                            )}

                            {/* SYSTEM — CENTER, SUBTLE */}
                            {role === "system" && (
                                <Box
                                    sx={{
                                        maxWidth: "75%",
                                        bgcolor: theme.palette.mode === "dark"
                                            ? "rgba(239,68,68,0.15)"
                                            : "#fee2e2",
                                        color: theme.palette.mode === "dark"
                                            ? "#fecaca"
                                            : "#7f1d1d",
                                        px: 2,
                                        py: 1.25,
                                        borderRadius: 2,
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                        border: "1px solid",
                                        borderColor: theme.palette.mode === "dark"
                                            ? "rgba(239,68,68,0.35)"
                                            : "#fecaca",

                                        "& p": { m: 0 },

                                        "& code": {
                                            fontFamily: "monospace",
                                            bgcolor: "rgba(0,0,0,0.08)",
                                            px: 0.5,
                                            borderRadius: 0.5,
                                        },
                                    }}
                                >
                                    <Markdown remarkPlugins={[remarkGfm]}>
                                        {content}
                                    </Markdown>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            ))}

            {/* Loader */}
            {isLoading && (
                <Box
                    sx={{
                        maxWidth: 900,
                        mx: "auto",
                        px: 2,
                        display: "flex",
                        justifyContent: "flex-start",
                        mb: 1.5,
                    }}
                >
                    <Loader />
                </Box>
            )}

            <div ref={messagesEndRef} />
        </Box>
    );
}
