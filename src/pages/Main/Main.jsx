import React, { useContext } from 'react';
import SessionContext from '../../context/SessionContext';
import Login from '../Login/Login';
import ChatPage from '../ChatPage';

function Main() {
  const { username } = useContext(SessionContext);

  return (
    <div>
      {username ? <ChatPage /> : <Login />}
    </div>
  );
}

export default Main;
