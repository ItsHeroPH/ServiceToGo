import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../assets/logo.png"
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useLoaderData();

    return (
        <>
            <div className="bg-citrus-peach-light w-screen h-screen flex flex-col">
                <div className="bg-citrus-rose w-full h-fit px-5 py-2 flex flex-col items-center gap-4">
                    <div className="w-full h-fit flex flex-row justify-between items-center">
                        <img className="w-20" src={logo}/>
                        <div className="bg-citrus-peach-light w-120 h-10 rounded-lg shadow-md p-1 flex items-center">
                            <input className="w-full h-fit px-1 outline-none align-middle text-citrus-rose font-medium" placeholder="Search for services"/>
                            <div className="bg-citrus-rose h-fit px-1.5 py-1 rounded-md cursor-pointer">
                                <FontAwesomeIcon className="text-sm text-citrus-peach-light" icon={faMagnifyingGlass}/>
                            </div>
                        </div>
                        <div className="flex flex-row items-center cursor-pointer" onClick={async() => {
                            const response = (await axios.get("/api/logout", { withCredentials: true})).data
                            if(response.status == 200) return navigate("/login")
                        }}>
                            <FontAwesomeIcon className="text-md text-citrus-peach-light" icon={faUser}/>
                            <p className="text-md text-citrus-peach-light font-bold">{user.username}</p>
                        </div>
                    </div>
                    <div className="w-fit h-fit flex flex-row gap-3 items-center">
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg"></div>
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg"></div>
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg"></div>
                        <div className="bg-citrus-peach-light w-10 h-10 rounded-full shadow-md cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-lg"></div>
                    </div>
                </div>
            </div>
        </>
    )
}