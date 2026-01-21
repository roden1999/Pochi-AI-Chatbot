import { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, AppBar, Toolbar, Typography, Tooltip, IconButton, CssBaseline } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//components
import { Assistant } from './components/Assistant/Assistant';
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Chat } from "./components/Chat/Chat";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [assistant, setAssistant] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChat = useMemo(
    () => chats.find(chat => chat.id === activeChatId)?.messages || [], [chats, activeChatId]
  );

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",

      primary: {
        main: "#F59E0B", // Pomeranian orange
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: "#7C3F1D", // warm brown
      },

      background: {
        default: darkMode ? "#1F140F" : "#FAFAFA",
        paper: darkMode ? "#2A1B14" : "#FFFFFF",
      },

      text: {
        primary: darkMode ? "#F9FAFB" : "#3A2A1F",
        secondary: darkMode ? "#D6D3D1" : "#6B7280",
      },

      divider: darkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB",
    },

    typography: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      h6: {
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 12,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("pochi-dark-mode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("pochi-dark-mode", String(darkMode));
  }, [darkMode]);


useEffect(() => {
    handleNewChat();
  }, []);

  const handleAssistantChange = useCallback((newAssistant: any) => {
    setAssistant(newAssistant);
  }, []);

  function handleChatUpdate(id: string, updatedChat: any) {
    const title = updatedChat[0]?.content.split(" ").slice(0, 7).join(" ");
    setChats(prevChats => prevChats.map(chat =>
      chat.id === id ? { ...chat, title: chat.title ?? title, messages: updatedChat } : chat
    ));
  }

  function handleNewChat() {
    const id = uuidv4();


    setChats(prevChats => [
      ...prevChats,
      { id, messages: [] }
    ]);
    setActiveChatId(id);
  }

  function handleActiveChatId(chatId: string) {
    setActiveChatId(chatId);
    setChats(prevChats => prevChats.filter(({ messages }) => messages.length > 0));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>

        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          activeChat={activeChat}
          onActiveChatId={handleActiveChatId}
          onNewChat={handleNewChat}
        />

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{
              bgcolor: "background.paper",
              borderBottom: "1px solid",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "center", // center horizontally
                gap: 1, // space between logo and text
              }}
            >
              {/* Logo */}
              <Box
                component="img"
                src="/chat-bot.png"
                alt="Chatbot Logo"
                sx={{ height: 50, width: 50 }}
              />

              {/* Title */}
              <Typography
                fontWeight={600}
                variant="h6"
                sx={{ color: "text.primary" }}
              >
                Pochi AI Chatbot
              </Typography>

              <Assistant onAssistantChange={handleAssistantChange} />

              <Box sx={{ flexGrow: 1 }} />

              {/* Dark Mode Toggle */}
              <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
                <IconButton onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          {chats
            .map((chat) => (
              <Chat
                key={chat.id}
                assistant={assistant}
                isActive={chat.id === activeChatId}
                chatId={chat.id}
                chatMessages={chat.messages}
                onChatUpdate={handleChatUpdate}
              />
            ))
          }

        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App