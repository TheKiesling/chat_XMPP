import React, { useContext } from 'react';
import SessionContext from '../../context/SessionContext';
import Login from '../Login/Login';
import Chat from '../Chat';

function Main() {
  const { username } = useContext(SessionContext);

  return (
    <div>
      {username ? <Chat /> : <Login />}
    </div>
  );
}

export default Main;
