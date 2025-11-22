import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/logo2.png";
import profile from "../assets/blank_profile.png";
import { faAngleUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navigation() {
    const navigate = useNavigate();
    const { user } = useLoaderData();
    const [showUserNav, setShowUserNav] = useState(false);

    return (
        <div className="bg-gray-100 w-full h-fit shadow-lg flex flex-row flex-wrap gap-2 justify-between md:justify-evenly items-center px-5 py-1.5 fixed top-0 z-80">
            <img className="w-20 cursor-pointer" src={logo} onClick={() => navigate("/")}/>
            <div className="bg-gray-200 w-full md:w-130 px-2 py-2 rounded-lg flex flex-row gap-1 justify-between items-center self-center order-3 md:order-2">
                <input className="bg-transparent w-full outline-none text-citrus-rose font-medium" placeholder="Search for services"/>
                <FontAwesomeIcon className="text-citrus-rose" icon={faMagnifyingGlass} />
            </div>
            { user ? (
                <div className="flex flex-row gap-2 justify-center items-center cursor-pointer order-2 md:order-3"
                    onClick={() => {
                        setShowUserNav((prev) => !prev)
                    }}
                >
                    <img className="w-10 rounded-full" src={user.avatar ? user.avatar : profile}/>
                    <p className="text-lg text-gray-500 font-bold hidden lg:block">{user.name}</p>
                    <FontAwesomeIcon className={`${showUserNav ? "rotate-180" : "rotate-0"} transition-all duration-300 text-gray-600`} icon={faAngleUp}/>
                </div>
            ) : (
                <button className="bg-citrus-rose px-3 py-1.5 rounded-lg select-none text-base text-white font-semibold cursor-pointer order-2 md:order-3"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            )}
        </div>
    )
}