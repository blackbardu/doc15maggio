import "./App.css";
import SideBar from "./components/Sidebar/SideBar";
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Italiano from "./pages/Italiano";
import Storia from "./pages/Storia";
import Inglese from "./pages/Inglese";
import Matematica from "./pages/Matematica";
import Informatica from "./pages/Informatica";
import Sistemi from "./pages/Sistemi";
import TPSIT from "./pages/TPSIT";
import GPOI from "./pages/GPOI";
import Religione from "./pages/Religione";
import Ginnastica from "./pages/Ginnastica";
import LoginPage from './pages/Login';
import Coordinatore from "./pages/Coordinatore";

function App() {
  

  return (

    <Router>
      <Routes>
      <Route exact path="/" element={<LoginPage/>} />
      </Routes>
      <SideBar>
        <Routes>
          <Route path="/main" element={<Dashboard />} />
          <Route path="/coordinatore" element={<Coordinatore />} />
          <Route path="/italiano" element={<Italiano />} />
          <Route path="/storia" element={<Storia />} />
          <Route path="/inglese" element={<Inglese />} />
          <Route path="/matematica" element={<Matematica />} />
          <Route path="/informatica" element={<Informatica />} />
          <Route path="/sistemi" element={<Sistemi />} />
          <Route path="/tpsit" element={<TPSIT />} />
          <Route path="/gpoi" element={<GPOI />} />
          <Route path="/religione" element={<Religione />} />
          <Route path="/ginnastica" element={<Ginnastica />} />

          <Route path="*" element={<> not found</>} />
        </Routes>
      </SideBar>
      
    </Router>
    
  );
}

export default App;
