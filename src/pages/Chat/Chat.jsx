import React, { useContext }from 'react'
import SessionContext from '../../context/SessionContext'
import Header from '../../components/Header'

const Chat = () => {
    const { username } = useContext(SessionContext)

    return (
        <div>
            <Header username={username} />
        </div>
    )
}

export default Chat