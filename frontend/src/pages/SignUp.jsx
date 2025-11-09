import { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";
import axios from "axios";

const Progress = lazy(() => import("../components/signup/Progress"));
const Email = lazy(() => import("../components/signup/Email"));
const Verify = lazy(() => import("../components/signup/Verify"));
const Password = lazy(() => import("../components/signup/Password"));
const Info = lazy(() => import("../components/signup/Info"));
const Done = lazy(() => import("../components/signup/Done"))

export default function Login() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [data, setData] = useState({});

    function handleChange(data) {
        setData((prev) => ({...prev, ...data }))
    }

    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen overflow-y-scroll no-scrollbar p-5 flex flex-col items-center space-y-6">
                <img className="w-52" src={logo}/>
                <div className="bg-citrus-peach-light w-80 rounded-xl shadow-xl px-5 py-6 flex flex-col gap-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <h1 className="text-xl text-citrus-rose font-bold cursor-default">Register</h1>
                    <Progress currentPage={page}/>
                    {
                        page == 1 ? (
                            <Email onNext={async (e) => {
                                setPage((prev) => prev + 1);
                                handleChange(e)
                                await axios.post(`${import.meta.env.VITE_API_URL}/register/send-code`, { email: e.email }, { withCredentials: true });;
                            }}/>
                        ) : page == 2 ? (
                            <Verify email={data.email} onNext={() => {
                                setPage((prev) => prev + 1);
                            }}/>
                        ) : page == 3 ? (
                            <Password onNext={(e) => {
                                setPage((prev) => prev + 1);
                                handleChange(e)
                            }}/>
                        ) : page == 4 ? (
                            <Info onNext={(e) => {
                                setPage((prev) => prev + 1);
                                handleChange(e)
                            }}/>
                        ) : (
                            <Done data={data} />
                        )
                    }
                    <p className="text-sm text-slate-500 text-center">Already have an account? <span className="transition-all duration-100 hover:underline hover:text-citrus-rose hover:font-semibold cursor-pointer" onClick={() => navigate("/login")}>Sign In</span></p>
                </div>
            </div>
        </>
    )
}