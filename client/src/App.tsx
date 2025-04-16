import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/pages/landingPage'
import Login from './components/pages/login'
import Signup from './components/pages/signup'
import Dashboard from './components/pages/dashboard'
import { Statistics } from './components/pages/Statistics'
import { Provider } from 'react-redux'
import appStore from './lib/store'
import { Toaster } from 'sonner'
import Navbar from './components/pages/navbar'
import PrivateRoute from './components/pages/privateRoute'
import PublicRoute from './components/pages/publicRoute'

function App() {
  return (
    <Provider store={appStore}>
      <Toaster/>
      <BrowserRouter basename='/'>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login/>
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup/>
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/stats" 
            element={
              <PrivateRoute>
                <Statistics/>
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App;
