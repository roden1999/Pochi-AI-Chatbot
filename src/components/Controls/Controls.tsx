import { useEffect, useRef, useState } from "react";
import { Box, IconButton, TextField, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

type ControlsProps = {
    isDisabled: boolean,
    onSend: (message: string) => void;
};

export function Control({ isDisabled = false, onSend }: ControlsProps) {
    const theme = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (!isDisabled) {
            textareaRef.current?.focus();
        }
    }, [isDisabled])

    function handleContentChange(e: any) {
        setContent(e.target.value)
    }

    function handleSend() {
        if (content.length > 0) {
            onSend(content);
            setContent("");
        }
    }

    function handleEnterPress(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <Box
            sx={{
                position: "sticky",
                bottom: 0,
                bgcolor: theme.palette.mode === "dark"
                    ? theme.palette.background.default
                    : "#f7f7f8",
                py: 2,
                borderTop: theme.palette.mode === "dark"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid #e5e7eb",
            }}
        >
            <Box
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    px: 2,
                    display: "flex",
                    gap: 1,
                    bgcolor: theme.palette.mode === "dark"
                        ? "#1f1f1f"
                        : "white",
                    borderRadius: 3,
                    border: theme.palette.mode === "dark"
                        ? "1px solid rgba(255,255,255,0.12)"
                        : "1px solid #e5e7eb",
                    boxShadow: theme.palette.mode === "dark"
                        ? "0 2px 10px rgba(0,0,0,0.5)"
                        : "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.25s ease",
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    variant="standard"
                    placeholder="Message Pochi..."
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            px: 2,
                            py: 1.25,
                            color: theme.palette.mode === "dark"
                                ? "#fff"
                                : "#111827",
                            "&::placeholder": {
                                color: theme.palette.mode === "dark"
                                    ? "rgba(255,255,255,0.5)"
                                    : "rgba(17,24,39,0.5)",
                            },
                        },
                    }}
                    value={content}
                    disabled={isDisabled}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => handleEnterPress(e)}
                />

                <IconButton color="primary" onClick={handleSend} disabled={isDisabled}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
