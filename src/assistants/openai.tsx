import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export class Assistant {
    #model
    #client
    constructor(model = "gpt-5-nano", client = openai) {
        this.#model = model;
        this.#client = client;
    }

    async chat(content: any, history: any) {
        try {
            const result = await this.#client.chat.completions.create({
                model: this.#model,
                messages: [...history, { role: "user", content }]
            });

            return result.choices[0].message.content;
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    async *chatStream(content: any, history: any) {
        try {
            const result = await this.#client.chat.completions.create({
                model: this.#model,
                messages: [...history, { role: "user", content }],
                stream: true,
            });

            for await (const chunk of result) {
                yield chunk.choices[0]?.delta?.content || "";
            }
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    #parseError(error: any) {
        return error;
    }
}