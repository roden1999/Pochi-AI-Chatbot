import { useState } from 'react';
import styles from './App.module.css';

//components
import { Chat } from "./components/Chat/Chat";
import { Control } from "./components/Controls/Controls";
import { Loader } from './components/Loader/Loader';
import { Assistant } from './components/Assistant/Assistant';
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
    <div className={styles.App}>
      {isLoading === true && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Control isDisabled={isLoading || isStreaming} onSend={handleSend} />

      <Assistant onAssistantChange={handleAssistantChange} />
    </div>
  )
}

export default App