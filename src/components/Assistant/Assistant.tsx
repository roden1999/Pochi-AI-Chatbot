import React, { useState, useEffect } from "react";
import styles from "./Assistant.module.css";

// Assistants APIs
import { Assistant as GoogleAIAssistant } from "../../assistants/googleai";
import { Assistant as OpenAIAssistant } from "../../assistants/openai";
import { Assistant as DeepSeekAIAssistant } from "../../assistants/deepseekai";

const optionMap = {
    googleai: GoogleAIAssistant,
    openai: OpenAIAssistant,
    deepseekai: DeepSeekAIAssistant,
};

type OptionKey = keyof typeof optionMap;

export function Assistant({ onAssistantChange }: any) {
    const [selectedApi, setSelectedApi] = useState<OptionKey>("googleai");

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedApi(event.target.value as OptionKey);
    }

    useEffect(() => {
        const AssistantClass = optionMap[selectedApi];

        if (!AssistantClass) {
            throw new Error(`Unknown api: ${selectedApi}`);
        }

        onAssistantChange(new AssistantClass());
    }, [selectedApi]);
    return (
        <div className={styles.Assistant}>
            <span>Select API:</span>
            <select defaultValue={selectedApi} onChange={handleSelectChange}>
                <option value="googleai">Google AI</option>
                <option value="openai">OpenAI</option>
                <option value="deepseekai">DeepSeek AI</option>
            </select>
        </div>
    );
}