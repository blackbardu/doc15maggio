import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SideBar from './components/Sidebar/SideBar';
import Dashboard from './pages/Dashboard';
import Italiano from './pages/Italiano';
import Storia from './pages/Storia';
import Inglese from './pages/Inglese';
import Matematica from './pages/Matematica';
import Informatica from './pages/Informatica';
import Sistemi from './pages/Sistemi';
import TPSIT from './pages/TPSIT';
import GPOI from './pages/GPOI';
import Religione from './pages/Religione';
import Ginnastica from './pages/Ginnastica';
import Coordinatore from './pages/Coordinatore'
import LoginPage from './pages/Login';
import { Button } from 'react-bootstrap';
import { MyArrayProvider } from './components/MyArrayContext';
import './App.css';
import Tabelle from './pages/Tabelle';
import Allegati from './pages/Allegati'

function PrivateRoute({ element: Element, loggedIn, ...rest }) {
  return loggedIn ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm('Sei sicuro di voler effettuare il logout?')) {
      setLoggedIn(false);
      setUsername('');
      window.location.href = "/"; 
    }
  };

  return (
    <MyArrayProvider>
    <Router>
      {loggedIn ? (
        <div>
          <div className="user-info">
            <span>Bentornato, {username}!</span>
            <Button variant="success" onClick={handleLogout}>Logout</Button>
          </div>
          <SideBar>
            <Routes>
              <Route path="/main" element={<PrivateRoute element={Dashboard} loggedIn={loggedIn} />} />
              <Route path="/coordinatore" element={<PrivateRoute element={Coordinatore} loggedIn={loggedIn} />} />
              <Route path="/tabelle" element={<PrivateRoute element={Tabelle} loggedIn={loggedIn} />} />
              <Route path="/allegati" element={<PrivateRoute element={Allegati} loggedIn={loggedIn} />} />
              <Route path="/italiano" element={<PrivateRoute element={Italiano} loggedIn={loggedIn} />} />
              <Route path="/storia" element={<PrivateRoute element={Storia} loggedIn={loggedIn} />} />
              <Route path="/inglese" element={<PrivateRoute element={Inglese} loggedIn={loggedIn} />} />
              <Route path="/matematica" element={<PrivateRoute element={Matematica} loggedIn={loggedIn} />} />
              <Route path="/informatica" element={<PrivateRoute element={Informatica} loggedIn={loggedIn} />} />
              <Route path="/sistemi" element={<PrivateRoute element={Sistemi} loggedIn={loggedIn} />} />
              <Route path="/tpsit" element={<PrivateRoute element={TPSIT} loggedIn={loggedIn} />} />
              <Route path="/gpoi" element={<PrivateRoute element={GPOI} loggedIn={loggedIn} />} />
              <Route path="/religione" element={<PrivateRoute element={Religione} loggedIn={loggedIn} />} />
              <Route path="/ginnastica" element={<PrivateRoute element={Ginnastica} loggedIn={loggedIn} />} />
            </Routes>
          </SideBar>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} loggedIn={loggedIn} />} />
        </Routes>
      )}
    </Router>
    </MyArrayProvider>
  );
}

export default App;
