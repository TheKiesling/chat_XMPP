import React from 'react';
import { BrowserRouter as Router, } from 'react-router-dom';
import { SessionProvider } from '../../context/SessionContext';
import Main from '../../pages/Main/Main';

function App() {
  return (
    <Router>
      <SessionProvider>
        <Main />
      </SessionProvider>
    </Router>
  );
}

export default App;
