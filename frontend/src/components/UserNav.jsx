import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import profile from "../assets/blank_profile.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function UserNav({ user }) {
    const navigate = useNavigate();
    const [showUserNav, setShowUserNav] = useState(false);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-1 cursor-pointer" onClick={() => setShowUserNav(!showUserNav)}>
                <img className="min-w-7 max-w-7 rounded-full" src={profile}/>
                <p className="text-md text-citrus-peach-light font-bold hidden sm:block">{user.username}</p>
                <FontAwesomeIcon className={`text-citrus-peach-light transition-all duration-300 ${showUserNav ? "rotate-180" : "rotate-0"}`} icon={faAngleUp}/>
            </div>
            <div className={`absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg 
                flex flex-col gap-4 py-2 px-3 transition-all duration-300 ease-out z-100
                    ${showUserNav ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none" }
                `}>
                <Link>Notifications</Link>
                <Link onClick={async() => {
                    return navigate("/chats")
                }}>Chats</Link>
                <Link onClick={async() => {
                    const response = (await axios.get(`${import.meta.env.VITE_API_URL}/user/delete`, { withCredentials: true })).data
                    if(response.status === 200) return navigate("/login")
                }}>Delete Account</Link>
                <Link onClick={async() => {
                    const response = (await axios.get(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true })).data
                    if(response.status === 200) return navigate("/login")
                }}>Logout</Link>
            </div>
        </div>
    )
}

function Link({ onClick = () => {}, children }) {
    return (
        <div className="text-md text-slate-500 font-semibold cursor-pointer transition-all duration-500 hover:text-citrus-pink" onClick={onClick}>
            {children}
        </div>
    )
}