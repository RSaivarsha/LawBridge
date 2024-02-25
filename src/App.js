import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Authentication/auth';
import Home from './components/home/home';
import Login from './components/Authentication/login';
import 'bootstrap/dist/css/bootstrap.min.css';
<link href="bootswatch/bootstrap.min.css" rel="stylesheet"/>

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
