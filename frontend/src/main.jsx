import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, redirect} from 'react-router-dom';
import axios from 'axios';
import "./index.css";
import LoadingScreen from './pages/LoadingScreen';

const Page404 = lazy(() => import("./pages/Page404"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Chats = lazy(() => import("./pages/Chats"));

const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <Page404/>
    ),
    HydrateFallback: () => <LoadingScreen/>,
  },
  {
    path: "/",
    element: (
      <LoadingScreen/>
    ),
    HydrateFallback: () => <LoadingScreen/>,
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
    HydrateFallback: () => <LoadingScreen/>,
    loader: async () => {
      const userFetch = await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true });
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
    HydrateFallback: () => <LoadingScreen/>,
    loader: async () => {
      const userFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true })).data;
      if(userFetch.status == 200) return redirect("/");
    }
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <SignUp />
      </Suspense>
    ),
    HydrateFallback: () => <LoadingScreen/>,
    loader: async () => {
      const userFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true })).data;
      if(userFetch.status == 200) return redirect("/");
    }
  },
  {
    path: "/chats",
    element: (
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <Chats />
      </Suspense>
    ),
    HydrateFallback: () => <LoadingScreen/>,
    loader: async () => {
      const userFetch = await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true });
      if(userFetch.data.status == 409) return redirect("/login");
      
      const userListFetch = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { withCredentials: true });
      const users = userListFetch.data.users;

      const messagePromises = users.map(async (u) => {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/message/${u.id}`, { withCredentials: true });
          if (res.data.status === 200) {
              const sorted = [...res.data.messages].sort(
                  (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
              return { userId: u.id, messages: sorted };
          } else {
              return { userId: u.id, messages: [] };
          }
      });
      const results = await Promise.all(messagePromises);

      return { user: userFetch.data.user, users: userListFetch.data.users, msgs: results }
    }
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
