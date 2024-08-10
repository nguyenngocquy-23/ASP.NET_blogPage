import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './voice.module.css'
import { FaMicrophone, FaStop } from 'react-icons/fa'; // Import các biểu tượng từ Font Awesome
Modal.setAppElement('#root'); // Thiết lập element gốc cho modal

const SpeechRecognitionComponent = ({setQuery}) => {
    const [transcript, setTranscript] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    let recognition = null;

    const startSpeechRecognition = () => {
        recognition = new window.webkitSpeechRecognition(); // Tạo đối tượng nhận dạng giọng nói

        recognition.lang = 'vi-VN'; // Thiết lập ngôn ngữ là tiếng Việt

        recognition.onstart = () => {
            setIsModalOpen(true); // Hiển thị modal khi bắt đầu ghi âm
            console.log('Đang nhận dạng...');
        };

        recognition.onresult = (event) => {
            const newTranscript = event.results[0][0].transcript;
            setQuery(newTranscript);
            console.log('Nhận dạng thành công:', newTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Lỗi nhận dạng:', event.error);
        };

        recognition.onend = () => {
            setIsModalOpen(false); // Đóng modal khi kết thúc ghi âm
            console.log('Kết thúc nhận dạng.');
        };

        recognition.start(); // Bắt đầu nhận dạng giọng nói
    };

    const stopSpeechRecognition = () => {
        if (recognition) {
            recognition.stop(); // Dừng nhận dạng giọng nói
            setIsModalOpen(false); // Đóng modal khi dừng ghi âm
        }
    };

    return (
        <div>
            <button onClick={startSpeechRecognition}>
                <FaMicrophone /> Bắt đầu ghi âm
            </button>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Ghi âm"
                className={styles['modal-content']}
                overlayClassName={styles['modal-overlay']}
            >
                <h2>Đang ghi âm...</h2>
                <button onClick={stopSpeechRecognition}>
                    <FaStop /> Dừng ghi âm
                </button>
            </Modal>
        </div>
    );
};

export default SpeechRecognitionComponent;