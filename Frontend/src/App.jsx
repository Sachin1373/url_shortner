import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router> 
      <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
