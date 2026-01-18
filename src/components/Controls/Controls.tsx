import { useEffect, useRef, useState } from "react";
import TextaraAutosize from 'react-textarea-autosize';
import styles from "./Controls.module.css";

type ControlsProps = {
    isDisabled: boolean,
    onSend: (message: string) => void;
};

export function Control({ isDisabled = false, onSend }: ControlsProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (!isDisabled) {
            textareaRef.current?.focus();
        }
    }, [isDisabled])

    function handleContentChange(e: any) {
        setContent(e.target.value)
    }

    function handleSend() {
        if (content.length > 0) {
            onSend(content);
            setContent("");
        }
    }

    function handleEnterPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
    return (
        <div className={styles.Controls}>
            <div className={styles.TextAreaContainer}>
                <TextaraAutosize
                    ref={textareaRef}
                    className={styles.TextArea}
                    disabled={isDisabled}
                    placeholder="Message AI Chatbot"
                    value={content}
                    minRows={1}
                    maxRows={4}
                    onChange={handleContentChange}
                    onKeyDown={handleEnterPress}
                />
            </div>
            <button className={styles.Button} disabled={isDisabled} onClick={handleSend}>
                <SendIcon />
            </button>
        </div>
    );
}

function SendIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5f6368"
        >
            <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
        </svg>
    );
}