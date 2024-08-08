import React, { useContext } from 'react';
import SessionContext from '../../context/SessionContext';
import Login from '../Login/Login';

function Main() {
  const { username } = useContext(SessionContext);

  return (
    <div>
      {username ? <div>Logged in</div> : <Login />}
    </div>
  );
}

export default Main;
