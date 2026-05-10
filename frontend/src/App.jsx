import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Login from './pages/Login/Login'
import Onboarding from './pages/Onboarding/Onboarding'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<><Navbar /><Hero /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Onboarding />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
