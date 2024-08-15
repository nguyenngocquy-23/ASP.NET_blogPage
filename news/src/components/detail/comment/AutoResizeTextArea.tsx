import React, { useState, useEffect, useRef } from 'react';

interface AutoResizeTextareaProps {
    text: string;
    onChange: (text: string) => void;
    submitLabel: string;
    isTextareaDisabled?: boolean;
    onSubmit: (event: React.FormEvent) => void;
}

const AutoResizeTextArea: React.FC<AutoResizeTextareaProps> = ({ text, onChange, submitLabel, isTextareaDisabled, onSubmit }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto to get the correct scrollHeight
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);

    return (
        <form className="form-comment" onSubmit={onSubmit}>
            <textarea
                ref={textareaRef}
                className="comment-form-textarea"
                value={text}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%', minHeight: '100px', boxSizing: 'border-box', padding: '10px', fontSize: '16px', lineHeight: '1.5' }}
            />
            <button className="comment-form-button" disabled={isTextareaDisabled}>{submitLabel}</button>
        </form>
    );
};

export default AutoResizeTextArea;