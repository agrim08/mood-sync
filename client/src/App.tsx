import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/pages/landingPage'
import Login from './components/pages/login'
import Signup from './components/pages/signup'
import Dashboard from './components/pages/dashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
