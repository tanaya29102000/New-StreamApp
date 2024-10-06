
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Corrected import path
import CreateVideo from './components/CreateVideo';
import Navbar from './components/Navbar';
import Home from './components/Home';
// import UpdateVideo from './components/UpdateVideo'; // Import for the new edit page

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/home" element={<Home />} /> 
          <Route path="/CreatePost" element={<CreateVideo />} /> 
          {/* <Route path="/update-post/:id" element={<UpdateVideo />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;