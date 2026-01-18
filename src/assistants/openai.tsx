import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export class Assistant {
    #model
    constructor(model = "gpt-5-nano") {
        this.#model = model
    }

    async chat(content: any, history: any) {
        try {
            const result = await openai.chat.completions.create({
                model: this.#model,
                messages: [...history, { role: "user", content }]
            });

            return result.choices[0].message.content;
        } catch (error) {
            throw error;
        }
    }

    async *chatStream(content: any, history: any) {
        try {
            const result = await openai.chat.completions.create({
                model: this.#model,
                messages: [...history, { role: "user", content }],
                stream: true,
            });

            for await (const chunk of result) {
                yield chunk.choices[0]?.delta?.content || "";
            }
        } catch (error) {
            throw error;
        }
    }
}