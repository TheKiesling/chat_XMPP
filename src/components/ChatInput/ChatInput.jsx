import React from 'react'
import styles from './ChatInput.module.css'
import Button from '../Button/Button'
import Input from '../Input/Input'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = () => {
    return (
        <div className={styles.container}>
            <Button icon={<AttachFileIcon />} />
            <Input  placeholder="Type a message..." />
            <Button icon={<SendIcon />} primary />
        </div>
    )
}

export default ChatInput
