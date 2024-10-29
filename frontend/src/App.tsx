import { Navigate, Route, Routes } from 'react-router-dom'
import Challenge from './Pages/Challenge'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { useAuthContext } from './Context/AuthContext'
import NavBar from './components/common/NavBar'
import AdminChallenge from './Pages/adminDashboard/AdminChallenge'
import AddChallenge from './Pages/adminDashboard/AddChallenge'

function App() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return null
  }

  return (
    <div className='w-full min-h-screen bg-background'>
      <NavBar />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to={'/login'} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/challenge" element={ <Challenge /> } />

          {/* should be a private route only available for admins */}
          <Route path='/adminChallenge' element={<AdminChallenge />} />
          <Route path='/addChallenge' element={<AddChallenge />} />
        </Routes>
    </div>
  )
}

export default App
