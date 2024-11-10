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
import UserDashboard from './Pages/UserDashboard'
import Challenges from './Pages/Challenges'
import Settings from './Pages/Settings'
import Profile from './Pages/Profile'
import AddGlobalAchievement from './Pages/adminDashboard/Achievement/AddGlobalAchievement'
import AdminGlobalAchievement from './Pages/adminDashboard/Achievement/AdminGlobalAchievement'
import MultiFa from './Pages/MultiFa'


function App() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return null
  }

  return (
    <div className='w-full min-h-screen bg-background'>
      
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/dashboard' element={user ? <UserDashboard /> : <Navigate to={'/login'} />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to={'/login'} /> } />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path='/multiFa' element={user ? <Navigate to={'/'} /> : <MultiFa />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/challenge" element={ <Challenge /> } />
        <Route path='/challenges' element={ <Challenges />} />
    
        <Route path='/profile/:userId' element={<Profile />} />

        {/* should be a private route only available for admins */}
        <Route path='/adminChallenge' element={<AdminChallenge />} />
        <Route path='/addChallenge' element={<AddChallenge />} />

        <Route path='/addGlobalAchievement' element={<AddGlobalAchievement />} />
        <Route path='/AdminGlobalAchievement' element={<AdminGlobalAchievement />} />
      </Routes>

      <footer className='bg-background border-t'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p>&copy; 2024 Type. All rights reserved</p>
            <div className='flex space-x-4 mt-4 md:mt-0'>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground hover:text-black'>
                <GithubIcon size={24} />
              </Link>
              <Link to='https://twitter.com' target='_blank' className='text-lg text-muted-foreground hover:text-black'>
                <TwitterIcon size={24} />
              </Link>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground hover:text-black'>
                <TwitchIcon size={24} />
              </Link>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground hover:text-black'>
                <FacebookIcon size={24} />
              </Link>
              <Link to='https://github.com' target='_blank' className='text-lg text-muted-foreground hover:text-black'>
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
