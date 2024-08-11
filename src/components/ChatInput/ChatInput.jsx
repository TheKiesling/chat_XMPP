import React from 'react'
import styles from './ChatInput.module.css'
import Button from '../Button/Button'
import Input from '../Input/Input'
import PropTypes from 'prop-types'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = ({disabled}) => {
    return (
        <div className={styles.container}>
            <Button icon={<AttachFileIcon />} disabled={disabled} />
            <Input  placeholder="Type a message..." />
            <Button icon={<SendIcon />} primary disabled={disabled} />
        </div>
    )
}

ChatInput.propTypes = {
    disabled: PropTypes.bool,
}

ChatInput.defaultProps = {
    disabled: false,
}

export default ChatInput
