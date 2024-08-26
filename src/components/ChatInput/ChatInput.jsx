import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './ChatInput.module.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = ({ disabled, onSendMessage, onSendFile }) => {
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(message);
        setMessage('');
    };

    const handleAttachFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onSendFile(file);
        }
    };

    return (
        <div className={styles.container}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <Button icon={<AttachFileIcon />} disabled={disabled} onClick={handleAttachFileClick} />
            <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)} />
            <Button icon={<SendIcon />} primary disabled={disabled || !message} onClick={handleSubmit} />
        </div>
    );
};

ChatInput.propTypes = {
    disabled: PropTypes.bool,
    onSendMessage: PropTypes.func.isRequired
};

export default ChatInput;