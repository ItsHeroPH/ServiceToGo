import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../assets/logo.png"
import profile from "../assets/blank_profile.png"
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useLoaderData();
    const [showUserNav, setShowUserNav] = useState(false)

    return (
        <>
            <div className="bg-citrus-peach-light w-screen h-screen flex flex-col">
                <div className="bg-citrus-rose w-full h-fit px-5 py-2 flex flex-col items-center gap-4">
                    <div className="w-full h-fit flex flex-row justify-between items-center gap-4">
                        <img className="w-20 cursor-pointer hidden md:block" src={logo} onClick={() => navigate("/home")}/>
                        <div className="bg-citrus-peach-light w-120 h-10 rounded-lg shadow-md p-1 flex items-center transition-all duration-500 hover:scale-102 hover:shadow-xl">
                            <input className="w-full h-fit px-1 outline-none align-middle text-citrus-rose font-medium" placeholder="Search for services"/>
                            <div className="bg-citrus-rose h-fit px-1.5 py-1 rounded-md cursor-pointer">
                                <FontAwesomeIcon className="text-sm text-citrus-peach-light" icon={faMagnifyingGlass}/>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex flex-row items-center gap-1 cursor-pointer" onClick={() => setShowUserNav(!showUserNav)}>
                                <img className="min-w-7 max-w-7 rounded-full" src={profile}/>
                                <p className="text-md text-citrus-peach-light font-bold hidden sm:block">{user.username}</p>
                            </div>
                            <div className={`absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg 
                                flex flex-col gap-2 py-2 px-3 transition-all duration-300 ease-out 
                                    ${showUserNav ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none" }
                                `}>
                                <a className="text-md text-slate-500 font-semibold cursor-pointer transition-all duration-500 hover:text-citrus-pink">
                                    Notifications
                                </a>
                                <a className="text-md text-slate-500 font-semibold cursor-pointer transition-all duration-500 hover:text-citrus-pink">
                                    Chats
                                </a>
                                <a className="text-md text-slate-500 font-semibold cursor-pointer transition-all duration-500 hover:text-citrus-pink" onClick={async() => {
                                    const response = (await axios.get("/api/logout")).data
                                    if(response.status == 200) return navigate("/login")
                                }}>Logout</a>
                            </div>
                        </div>
                    </div>
                    <div className="w-fit h-fit flex flex-row gap-3 items-center">
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg">

                        </div>
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg">

                        </div>
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg">

                        </div>
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}