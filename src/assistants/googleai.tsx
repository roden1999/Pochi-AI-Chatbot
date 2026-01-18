import { GoogleGenerativeAI } from '@google/generative-ai';

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);


export class Assistant {
    #chat;
    constructor(model = "gemini-3-flash-preview") {
        const gemini = googleai.getGenerativeModel({ model });
        this.#chat = gemini.startChat({ history: [] });
    }

    async chat(content: any) {
        try {
            const result = await this.#chat.sendMessage(content);
            return result.response.text();
        } catch (error) {
            throw error;
        }
    }

    async *chatStream(content: any) {
        try {
            const result = await this.#chat.sendMessageStream(content);

            for await (const chunk of result.stream) {
                yield chunk.text();
            }
        } catch (error) {
            throw error;
        }
    }

}