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
            throw this.#parseError(error);
        }
    }

    async *chatStream(content: any) {
        try {
            const result = await this.#chat.sendMessageStream({ message: content });

            for await (const chunk of result) {
                yield chunk.text;
            }
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    #parseError(error: any): Error {
        try {
            // STEP 1: error.message is a JSON STRING
            if (typeof error?.message === "string") {
                const outer = JSON.parse(error.message);

                // STEP 2: outer.error.message is ALSO a JSON STRING
                if (typeof outer?.error?.message === "string") {
                    const inner = JSON.parse(outer.error.message);

                    // STEP 3: inner.error.message is the real text
                    if (typeof inner?.error?.message === "string") {
                        return new Error(inner.error.message);
                    }
                }
            }

            // Fallbacks
            if (error instanceof Error) {
                return error;
            }

            return new Error("Unknown error occurred.");
        } catch {
            return new Error(
                typeof error?.message === "string"
                    ? error.message
                    : "Unknown error occurred."
            );
        }
    }

}