import { faAngleUp, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../assets/logo2.png";
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
                <div className="flex flex-col">
                    <p className="text-md text-citrus-peach-light font-bold hidden sm:block overflow-hidden break-all text-ellipsis line-clamp-1 truncate">{user.name}</p>
                    <p className="text-xs text-citrus-peach-light font-bold hidden sm:block">@{user.username}</p>
                </div>
                <FontAwesomeIcon className={`text-citrus-peach-light transition-all duration-300 ${showUserNav ? "rotate-180" : "rotate-0"}`} icon={faAngleUp}/>
            </div>
            <div className={`bg-black/50 fixed w-[100%] h-[100%] z-99 left-0 top-0 transition-all duration-300 ease-out md:hidden md:pointer-events-none
                ${showUserNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `} onClick={() => setShowUserNav(false)} />
            <div className={`fixed md:absolute right-0 md:left-auto top-0 w-70 h-screen md:w-44 md:h-fit bg-white md:rounded-lg shadow-lg 
                flex flex-col transition-all duration-300 ease-out z-100 overflow-hidden
                    ${showUserNav ? "left-0 md:opacity-100 md:top-9 pointer-events-auto" : "-left-full md:opacity-0 md:top-0 pointer-events-none" }
            `}>
                <div className="flex flex-col p-5 md:hidden">
                    <button className="self-end bg-citrus-rose w-8 h-8 rounded-lg" onClick={() => setShowUserNav(false)}>
                        <FontAwesomeIcon className="text-citrus-peach-light rotate-180" icon={faRightToBracket}/>
                    </button>
                    <img className="w-[60%] mx-auto cursor-pointer" src={logo} onClick={() => navigate("/home")}/> 
                </div>               
                <Link onClick={() => {
                    navigate("/profile")
                }}>Profile</Link>
                <Link onClick={() => {
                    navigate("/notification")
                }}>Notifications</Link>
                <Link onClick={async() => {
                    return navigate("/chats")
                }}>Chats</Link>
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
        <div className="w-full py-2 px-3 text-md text-slate-500 font-semibold cursor-pointer transition-all duration-500 hover:text-citrus-pink hover:bg-slate-100" onClick={onClick}>
            {children}
        </div>
    )
}