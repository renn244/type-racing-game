import { Navigate, Route, Routes } from 'react-router-dom'
import Challenge from './Pages/Challenge'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import { useAuthContext } from './Context/AuthContext'
import NavBar from './components/common/NavBar'
import AdminChallenge from './Pages/adminDashboard/AdminChallenge'
import AddChallenge from './Pages/adminDashboard/AddChallenge'
import { GithubIcon, TwitterIcon, TwitchIcon, FacebookIcon, LinkedinIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

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

      <footer className='bg-background border-t'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p>&copy; 2024 Type. All rights reserved</p>
            <div className='flex space-x-4 mt-4 md:mt-0'>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground'>
                <GithubIcon size={24} />
              </Link>
              <Link to='https://twitter.com' target='_blank' className='text-lg text-muted-foreground'>
                <TwitterIcon size={24} />
              </Link>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground'>
                <TwitchIcon size={24} />
              </Link>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground'>
                <FacebookIcon size={24} />
              </Link>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground'>
                <LinkedinIcon size={24} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  )
}

export default App
