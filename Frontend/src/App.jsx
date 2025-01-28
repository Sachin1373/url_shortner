import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from './pages/SignUp'
import Redirect from './Components/redirect';
import Login from './pages/Login'
import Dashboard from './pages/dashboard';
import './App.css'

function App() {
 
  return (
    <Router> 
      <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/redirect/:id" element={<Redirect />} />
      </Routes>
    </Router>
  )
}

export default App
