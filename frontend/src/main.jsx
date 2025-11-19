import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, redirect} from 'react-router-dom';
import "./index.css";
import { LoggerProvider } from './provider/LoggerProvider';
import { lazy } from 'react';
import { getUser } from './util/user';

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    loader: async() => {
      const user = await getUser();

      return { user }
    }
  },
  {
    path: "/login",
    element: <LoginPage/>,
    loader: async() => {
      const user = await getUser();
      if(user) return redirect("/");
    }
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoggerProvider>
      <RouterProvider router={router}/>
    </LoggerProvider>
  </StrictMode>
)
