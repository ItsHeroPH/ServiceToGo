import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { lazy } from "react";


const UserNav = lazy(() => import("./UserNav"));

export default function Navigation({ user }) {
    const navigate = useNavigate();

    return (
        <div className="bg-citrus-rose w-full h-fit px-5 py-2 flex flex-row justify-between items-center gap-4">
            <img className="w-20 cursor-pointer hidden md:block" src={logo} onClick={() => navigate("/home")}/>
            <div className="bg-citrus-peach-light w-120 h-10 rounded-lg shadow-md p-1 flex items-center transition-all duration-500 hover:scale-102 hover:shadow-xl">
                <input className="w-full h-fit px-1 outline-none align-middle text-citrus-rose font-medium" placeholder="Search for services"/>
                <div className="bg-citrus-rose h-fit px-1.5 py-1 rounded-md cursor-pointer">
                    <FontAwesomeIcon className="text-sm text-citrus-peach-light" icon={faMagnifyingGlass}/>
                </div>
            </div>
            <UserNav user={user}/>
        </div>
    )
}