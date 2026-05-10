import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Public pages
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import HowItWorks from './components/HowItWorks/HowItWorks'
import Login from './pages/Login/Login'
import Onboarding from './pages/Onboarding/Onboarding'
import AuthCallback from './pages/Auth/AuthCallback'

// Dashboard shell + pages
import DashboardLayout from './pages/Dashboard/DashboardLayout/Dashboardlayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Trips from './pages/Dashboard/Trips/Trips'
import Itinerary from './pages/Dashboard/Itenary/Itenary'
import Budget from './pages/Dashboard/Budget/Budget'
import Community from './pages/Dashboard/Community/Community'
import Profile from './pages/Dashboard/Profile/Profile'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<><Navbar /><Hero /><HowItWorks /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Onboarding />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Dashboard — shared Navbar + Sidebar layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/trips"      element={<Trips />} />
            <Route path="/itinerary"  element={<Itinerary />} />
            <Route path="/budget"     element={<Budget />} />
            <Route path="/community"  element={<Community />} />
            <Route path="/profile"    element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
