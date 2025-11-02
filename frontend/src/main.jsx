import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import "./index.css"

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense>
        <Home />
      </Suspense>
    )
  },
  {
    path: "/login",
    element: (
      <Suspense>
        <Login />
      </Suspense>
    )
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
