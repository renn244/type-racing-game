import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Challenge from './Pages/Challenge'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { useAuthContext } from './Context/AuthContext'
import PrivateRoute from './components/common/PrivateRoutes'
import NavBar from './components/common/NavBar'

function App() {
  const { user, loading } = useAuthContext()

  console.log(user)

  if (loading) {
    return null
  }

  return (
    <div className='w-full min-h-screen'>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/challenge" element={ <Challenge /> } />
        </Routes>
    </div>
  )
}

export default App
