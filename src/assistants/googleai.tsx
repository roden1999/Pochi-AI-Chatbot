import { GoogleGenAI } from '@google/genai';

const googleai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });


export class Assistant {
    #chat;
    constructor(model = "gemini-3-flash-preview") {
        this.#chat = googleai.chats.create({ model });
    }

    async chat(content: any) {
        try {
            const result = await this.#chat.sendMessage({ message: content });
            return result.text;
        } catch (error) {
            throw error;
        }
    }

    async *chatStream(content: any) {
        try {
            const result = await this.#chat.sendMessageStream({ message: content });

            for await (const chunk of result) {
                yield chunk.text;
            }
        } catch (error) {
            throw error;
        }
    }

}