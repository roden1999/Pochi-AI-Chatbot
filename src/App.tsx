import { useState } from 'react';
import styles from './App.module.css';

//components
import { Chat } from "./components/Chat/Chat";
import { Control } from "./components/Controls/Controls";
import { Loader } from './components/Loader/Loader';

//ai
import { Assistant } from './assistants/googleai';
// import { Assistant } from './assistants/openai';



interface ChatMessage {
  role: "user" | "assistant";
  content: string;
};

const MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hello! How can  I assist you right now?"
  },
];

function App() {
  const assistant = new Assistant();
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
      /*            Google Gemini                  */
      const result = await assistant.chatStream(content);

      /*                OpenAI                     */
      // const result = await assistant.chat(content, messages);

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
    } catch (error) {
      console.log(error);
      addMessage({ role: "system", content: "Sorry, I couldn't process your request. Please try again." });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
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
    </div>
  )
}

export default App
