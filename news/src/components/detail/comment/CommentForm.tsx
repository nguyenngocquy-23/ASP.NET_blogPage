import React, {useEffect, useRef, useState} from 'react';
import './CommentStyle.css'

interface CommentFormProps {
    handleSubmit : (text: string, parentId?: number| null) => void;
    submitLabel : string;
    hasCancelButton?: boolean;
    initialText?: string;
    handleCancel?: () => void;
}

const CommentForm:React.FC<CommentFormProps> = ({handleSubmit, submitLabel, hasCancelButton = false,initialText = '',
                                                handleCancel,
                                                }) => {

    const [text, setText] = useState<string>(initialText);

    // Check xem người dùng đã nhập comment ch mới cho submit
    const isTextareaDisabled = text.length === 0;

    const onSubmit = (event: React.FormEvent) => {
         event.preventDefault();
         handleSubmit(text);
         setText('');
    }

    // xử lý text area
    const textAreaRef = useRef<HTMLTextAreaElement | null> (null);

    const resizeTextArea = () => {
        if (!textAreaRef.current) {
            return;
        }

        textAreaRef.current.style.height = "auto"; // will not work without this!
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    };

    useEffect(() => {
        resizeTextArea();
        window.addEventListener("resize", resizeTextArea);
    }, []);

    return (
       <form className="form-comment" onSubmit={onSubmit}>
           <textarea placeholder="Nhập gì đó ..."
               className="comment-form-textarea"
               value={text}
                     ref={textAreaRef}

               onChange={(e) => {
                   setText(e.target.value);
                    resizeTextArea();
               }}
           />
             <button className="comment-form-button" disabled={isTextareaDisabled} >{submitLabel} </button>
           {hasCancelButton && ( <button type="button" className="comment-form-button comment-form-cancel-button"

            onClick={handleCancel}
            >Hủy</button>
               )}

       </form>
    );
};

export default CommentForm;