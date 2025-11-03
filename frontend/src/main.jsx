import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, redirect} from 'react-router-dom'
import axios from 'axios'
import "./index.css"
import LoadingScreen from './pages/LoadingScreen'

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))

const router = createBrowserRouter([
  {
    path: "/",
    loader: async() => {
      return redirect("/home")
    }
  },
  {
    path: "/home",
    element: (
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <Home />
      </Suspense>
    ),
    loader: async () => {
      const userFetch = await axios.get(`/api/user`, { withCredentials: true });
      if(userFetch.data.status == 409) return redirect("/login");
      return { user: userFetch.data.user }
    }
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <Login />
      </Suspense>
    ),
    loader: async () => {
      const userFetch = (await axios.get(`/api/user`, { withCredentials: true })).data;
      if(userFetch.status == 200) return redirect("/");
    }
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
