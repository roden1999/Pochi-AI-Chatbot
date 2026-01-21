import { useState } from "react";
import { Box, Button, Typography, Stack, IconButton, Tooltip, useTheme, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

type ControlsProps = {
    chats: any[],
    activeChatId: string,
    activeChat: any[],
    onActiveChatId: (message: string) => void;
    onNewChat: (message: any) => void;
};

export function Sidebar({ chats, activeChatId, activeChat, onActiveChatId, onNewChat }: ControlsProps) {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const toggleSidebar = () => setOpen(!open);

    const isDark = theme.palette.mode === "dark";

    const sidebarBg = isDark
        ? theme.palette.background.paper
        : theme.palette.primary.main;

    const sidebarText = isDark
        ? theme.palette.text.primary
        : theme.palette.primary.contrastText;

    const hoverBg = isDark
        ? "action.hover"
        : "rgba(0,0,0,0.18)";

    const activeBg = isDark
        ? theme.palette.action.selected
        : "rgba(0,0,0,0.22)";

    function handleChatSelect(chatId: string) {
        onActiveChatId(chatId);
    }

    return (
        <Box
            sx={{
                width: open ? 260 : 64, // slightly wider for collapsed
                bgcolor: sidebarBg,
                color: sidebarText,
                borderRight: "1px solid",
                borderColor: isDark ? "divider" : "rgba(0,0,0,0.12)",
                p: 2,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                transition: "width 0.25s ease",
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: open ? "space-between" : "center", mb: 2 }}>
                {open && <Typography variant="h6" sx={{ fontWeight: 600, color: sidebarText }}>Chats</Typography>}
                <IconButton onClick={toggleSidebar} sx={{ color: sidebarText, "&:hover": { bgcolor: hoverBg } }}>
                    {open ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            {/* New chat button */}
            <Tooltip title={open ? "" : "New chat"} placement="right">
                <Button
                    startIcon={open ? <AddIcon /> : undefined}
                    fullWidth={open}
                    disabled={activeChat.length === 0}
                    onClick={onNewChat}
                    sx={{
                        mb: 2,
                        color: sidebarText,
                        border: "1px solid",
                        borderColor: isDark ? "divider" : "rgba(255,255,255,0.35)",
                        bgcolor: isDark ? "transparent" : "rgba(255,255,255,0.1)",
                        minWidth: 0,
                        width: open ? "100%" : 40,
                        height: 40,
                        p: open ? "6px 10px" : 0,
                        justifyContent: "center",
                        borderRadius: 2,
                        display: "flex",
                        "&:hover": { bgcolor: hoverBg },
                    }}
                >
                    {open ? "New chat" : <AddIcon fontSize="small" />}
                </Button>
            </Tooltip>

            {/* Chat list */}
            <Stack spacing={1}>
                {open && chats.filter(({ messages }) => messages.length > 0).map((chat) => (
                    <Tooltip key={chat.id} title={open ? "" : chat.title} placement="right" onClick={e => handleChatSelect(chat.id)}>
                        <Box
                            sx={{
                                width: open ? "100%" : 40,
                                height: 40,
                                borderRadius: 2,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: open ? "flex-start" : "center",
                                px: open ? 1.5 : 0,
                                bgcolor: chat.id === activeChatId ? activeBg : "transparent",
                                color: sidebarText,
                                "&:hover": { bgcolor: hoverBg },
                            }}
                        >
                            <Typography variant="body2" noWrap>
                                {chat.title}
                            </Typography>
                        </Box>
                    </Tooltip>
                ))}
            </Stack>
        </Box>
    );
}
