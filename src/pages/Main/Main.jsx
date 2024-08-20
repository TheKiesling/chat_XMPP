import React, { useContext } from 'react';
import SessionContext from '../../context/SessionContext';
import Login from '../Login/Login';
import ChatPage from '../ChatPage';
import LoadingPage from '../LoadingPage/LoadingPage';

function Main() {
  const { username, loading } = useContext(SessionContext);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div>
      {username ? <ChatPage /> : <Login />}
    </div>
  );
}

export default Main;
