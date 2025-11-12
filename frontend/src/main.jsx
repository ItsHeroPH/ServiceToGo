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
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const Chats = lazy(() => import("./pages/Chats"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Address = lazy(() => import("./pages/profile/Address"));

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
      const userFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true })).data;
      if(userFetch.status == 409) return redirect("/login");
      let userdata = userFetch.user;
      if(userdata.avatar) {
        const avatar = (await axios.get(`${import.meta.env.VITE_API_URL}/images/${userdata.avatar}`, { withCredentials: true, responseType: "blob" })).data;
        return { user: {...userdata, avatar: URL.createObjectURL(avatar)}}
      }
      return { user: userdata }
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
      if(userFetch.status == 200) return redirect("/home");
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
      if(userFetch.status == 200) return redirect("/home");
    }
  },
  {
    path: "/resetpassword",
    element: (
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <PasswordReset />
      </Suspense>
    ),
    HydrateFallback: () => <LoadingScreen/>,
    loader: async () => {
      const userFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true })).data;
      if(userFetch.status == 200) return redirect("/home");
    }
  },
  {
    path: "/me",
    element: <LoadingScreen/>,
    HydrateFallback: () => <LoadingScreen/>,
    loader: async() => {
      return redirect("/me/profile");
    }
  },
  {
    path: "/me/profile",
    element: (
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <Profile />
      </Suspense>
    ),
    HydrateFallback: () => <LoadingScreen/>,
    loader: async () => {
      const userFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true })).data;
      if(userFetch.status == 409) return redirect("/login");
      let userdata = userFetch.user;
      if(userdata.avatar) {
        const avatar = (await axios.get(`${import.meta.env.VITE_API_URL}/images/${userdata.avatar}`, { withCredentials: true, responseType: "blob" })).data;
        return { user: {...userdata, avatar: URL.createObjectURL(avatar)}}
      }
      return { user: userdata }
    }
  },
  {
    path: "/me/address",
    element: (
      <Suspense fallback={
        <LoadingScreen/>
      }>
        <Address />
      </Suspense>
    ),
    HydrateFallback: () => <LoadingScreen/>,
    loader: async () => {
      const userFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true })).data;
      if(userFetch.status == 409) return redirect("/login");
      let userdata;
      if(userFetch.user.avatar) {
        const avatar = (await axios.get(`${import.meta.env.VITE_API_URL}/images/${userFetch.user.avatar}`, { withCredentials: true, responseType: "blob" })).data;
        userdata = {...userFetch.user, avatar: URL.createObjectURL(avatar)}
      } else {
        userdata = userFetch.user;
      }

      const addressFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/address`, { withCredentials: true })).data;
      

      return { user: userdata, addresses: addressFetch.addresses }
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
      const userFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true })).data;
      if(userFetch.status == 409) return redirect("/login");

      let userdata = userFetch.user;
      if(userdata.avatar) {
        const avatar = (await axios.get(`${import.meta.env.VITE_API_URL}/images/${userdata.avatar}`, { withCredentials: true, responseType: "blob" })).data;
        userdata = {...userdata, avatar: URL.createObjectURL(avatar)}
      }
      
      const userListFetch = (await axios.get(`${import.meta.env.VITE_API_URL}/users`, { withCredentials: true })).data;
      const users = userListFetch.users;

      const usersAvatarPromise = users.map(async(user) => {
        if(user.avatar) {
          const avatar = (await axios.get(`${import.meta.env.VITE_API_URL}/images/${user.avatar}`, { withCredentials: true, responseType: "blob" })).data;
          return {...user, avatar: URL.createObjectURL(avatar)}
        }
        return {...user}
      })
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
      const usersAvatars = await Promise.all(usersAvatarPromise);
      const userMessages = await Promise.all(messagePromises);

      return { user: userdata, users: usersAvatars, msgs: userMessages }
    }
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
