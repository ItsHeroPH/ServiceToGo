import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import logo from "../assets/logo.png"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    
    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen p-5 flex flex-col items-center space-y-6">
                <img className="w-52" src={logo}/>
                <div className="bg-citrus-peach-light w-80 rounded-xl shadow-xl px-5 py-6 flex flex-col gap-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <h1 className="text-xl text-citrus-rose font-bold cursor-default">Login</h1>
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
                            <FontAwesomeIcon className="text-citrus-pink cursor-pointer" icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)}/>
                        </div>
                    </div>
                    <div>
                        { hasError ? <p className="text-sm text-rose-400 font-semibold">{error}</p> : <></>  }
                        <button 
                            className="bg-citrus-rose w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg"
                            onClick={
                                async () => {
                                    if(email.length > 0 && password.length > 0) {
                                        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                                            const response = await (await axios.post("/api/login", { email, password }, { withCredentials: true })).data
                                            if(response.status == 200) {
                                                return navigate("/home");
                                            } else {
                                                setHasError(true)
                                                setError("Email or Password is incorrect.")
                                            }
                                        } else {
                                            setHasError(true)
                                            setError("Email is invalid.")
                                        }
                                    }
                                }
                            }>
                                LOGIN
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 text-center">Don't have an account? <span className="transition-all duration-100 hover:underline hover:text-citrus-rose hover:font-semibold cursor-pointer">Sign Up</span></p>
                </div>
            </div>
        </>
    )
}