import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './ChatInput.module.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';


const ChatInput = ({ disabled, onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(message);
        setMessage('');
    }

    return (
        <div className={styles.container}>
            <Button icon={<AttachFileIcon />} disabled={disabled} />
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
