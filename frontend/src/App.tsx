import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Challenge from './Pages/Challenge'
import Register from './Pages/Register'
import Login from './Pages/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <h2>this is the home page</h2>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/challenge',
    element: <Challenge />
  }
])

function App() {

  return (
    <div className='w-full min-h-screen'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
