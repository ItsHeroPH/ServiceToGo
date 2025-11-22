import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, redirect} from 'react-router-dom';
import "./index.css";
import { LoggerProvider } from './provider/LoggerProvider';
import { lazy } from 'react';
import { getUser } from './util/user';
import LoadingScreen from './components/LoadingScreen';

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Register"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<LoadingScreen/>}>
        <HomePage/>
      </Suspense>,
    loader: async() => {
      const user = await getUser();

      return { user }
    }
  },
  {
    path: "/login",
    element: <Suspense fallback={<LoadingScreen/>}>
        <LoginPage/>
      </Suspense>,
    loader: async() => {
      const user = await getUser();
      if(user) return redirect("/");
    }
  },
  {
    path: "/register",
    element: <Suspense fallback={<LoadingScreen/>}>
        <RegisterPage/>
      </Suspense>,
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
