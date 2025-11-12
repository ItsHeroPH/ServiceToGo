import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/logo.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(1);
    
    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen p-5 flex flex-col items-center space-y-6">
                <img className="w-52" src={logo}/>
                <div className="bg-citrus-peach-light w-80 rounded-xl shadow-xl px-5 py-6 flex flex-col gap-3">
                    <h1 className="text-xl text-citrus-rose font-bold cursor-default">Login</h1>
                    {
                        progress == 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-citrus-orange">Email</label>
                                    <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="email" onChange={(e) => {
                                        setEmail(e.target.value)
                                        setHasError(false)
                                    }} placeholder="Email"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-citrus-orange">Password</label>
                                    <div className="bg-slate-200 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center gap-2">
                                        <input className="w-full outline-none text-md text-citrus-pink font-semibold" type={showPassword ? "text" : "password"} onChange={(e) => {
                                            setPassword(e.target.value)
                                            setHasError(false)
                                        }} placeholder="Password"/>
                                        <FontAwesomeIcon className="text-citrus-pink cursor-pointer" icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword((prev) => !prev)}/>
                                    </div>
                                </div>
                                <button className="text-sm text-citrus-rose font-bold self-start cursor-pointer" onClick={() => navigate("/resetpassword")}>Forgot Password?</button>
                                <div>
                                    { hasError && <p className="text-sm text-rose-400 font-semibold">{error}</p>  }
                                    <button 
                                        className={`${!isLoading && ((email.length > 0 && password.length > 0) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? "bg-citrus-rose cursor-pointer pointer-events-auto" : "bg-citrus-rose/50 pointer-events-none"} select-none w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                                        onClick={
                                            async () => {
                                                setIsLoading(true)
                                                const response = await (await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password }, { withCredentials: true })).data
                                                if(response.status === 402) {
                                                    const sendcode = (await axios.post(`${import.meta.env.VITE_API_URL}/send-code`, { email })).data;
                                                    if(sendcode.status === 200) {
                                                        setIsLoading(false)
                                                        setProgress(2)
                                                    }
                                                } else {
                                                    setIsLoading(false)
                                                    setHasError(true)
                                                    setError("Email or Password is incorrect.")
                                                }
                                            }
                                        }>
                                            Next
                                    </button>
                                </div>
                            </>
                        )
                    }
                    {
                        progress == 2 && (
                            <>
                                <p className="text-sm text-slate-500">We sent you a 6-digits Verification Code to your email.</p>
                                <div>
                                    <label className="block text-sm font-semibold text-citrus-orange">Verification Code</label>
                                    <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="email" onChange={(e) => {
                                        setCode(e.target.value)
                                    }} placeholder="Code" max={6}/>
                                </div>
                                <div>
                                    { hasError && <p className="text-sm text-rose-400 font-semibold">{error}</p>  }
                                    <button 
                                        className={`${isLoading ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose pointer-events-auto cursor-pointer"} w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                                        onClick={
                                            async () => {
                                                setIsLoading(true)
                                                if(code.length === 6) {
                                                    const verify = (await axios.post(`${import.meta.env.VITE_API_URL}/verify`, { email, code, remove: true }, { withCredentials: true })).data;
                                                    if(verify.status == 200) {
                                                        const login = (await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password, code }, { withCredentials: true })).data;
                                                        if(login.status == 200) return navigate("/home")
                                                    } else {
                                                        setIsLoading(false)
                                                        setHasError(true)
                                                        setError(verify.message)
                                                    }
                                                } else {
                                                    setIsLoading(false)
                                                    setHasError(true)
                                                    setError("Please enter a valid 6-digits code.");
                                                }
                                            }
                                        }>
                                            Login
                                    </button>
                                </div>
                            </>
                        )
                    }
                    <p className="text-sm text-slate-500 text-center">Don't have an account? <span className="transition-all duration-100 hover:underline hover:text-citrus-rose hover:font-semibold cursor-pointer" onClick={() => navigate("/register")}>Sign Up</span></p>
                </div>
            </div>
        </>
    )
}