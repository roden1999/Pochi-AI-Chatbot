import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Tooltip, IconButton, CssBaseline } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//components
import { Chat } from "./components/Chat/Chat";
import { Control } from "./components/Controls/Controls";
import { Loader } from './components/Loader/Loader';
import { Assistant } from './components/Assistant/Assistant';
import { Sidebar } from "./components/Sidebar/Sidebar";
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

let assistant: any;

function App() {
  // const assistant = new APIAssistant();
  const [messages, setMessages] = useState<ChatMessage[]>(MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  function handleAssistantChange(newAssistant: any) {
    assistant = newAssistant;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>

        <Sidebar />

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

          <Chat messages={messages} isLoading={isLoading} />

          <Control
            isDisabled={isLoading || isStreaming}
            onSend={handleSend}
          />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App