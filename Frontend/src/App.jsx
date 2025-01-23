import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Dashboard from './pages/dashboard';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router> 
      <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  )
}

export default App
