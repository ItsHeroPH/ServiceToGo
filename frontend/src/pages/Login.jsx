import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import logo from "../assets/logo.png"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen p-5 flex flex-col items-center space-y-6">
                <img className="w-52" src={logo}/>
                <div className="bg-citrus-peach-light w-80 rounded-xl shadow-2xl px-5 py-6 flex flex-col gap-3">
                    <h1 className="text-xl text-citrus-rose font-bold">Login</h1>
                    <div>
                        <label className="block text-sm font-semibold text-citrus-orange">Email</label>
                        <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="email" placeholder="Email"/>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-citrus-orange">Password</label>
                        <div className="bg-slate-200 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center">
                            <input className="w-full outline-none text-md text-citrus-pink font-semibold" type={showPassword ? "text" : "password"} placeholder="Password"/>
                            <FontAwesomeIcon className="text-citrus-pink cursor-pointer" icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)}/>
                        </div>
                    </div>
                    <button className="bg-citrus-rose w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold cursor-pointer">LOGIN</button>
                    <p className="text-sm text-slate-500 text-center">Don't have an account? <span className="hover:underline hover:text-citrus-rose cursor-pointer">Sign Up</span></p>
                </div>
            </div>
        </>
    )
}