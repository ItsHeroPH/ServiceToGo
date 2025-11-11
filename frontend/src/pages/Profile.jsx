import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, lazy } from "react";
import logo from "../assets/logo.png";
import { useLoaderData, useNavigate } from "react-router-dom";

const UserNav = lazy(() => import("../components/UserNav"));
const SideBar = lazy(() => import("../components/profile/Sidebar"));

import ProfileSection from "../components/profile/ProfileSection";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useLoaderData();
    const [showSidebar, setShowSideBar] = useState(false);
    
    return (
        <div className="bg-citrus-rose w-screen h-screen flex flex-col gap-2">
            <div className="w-full h-fit shadow-lg py-2 px-4 flex flex-row justify-between items-center">
                <div className="flex flex-row gap-4">
                    <button className="bg-citrus-peach-light px-2 rounded-lg cursor-pointer lg:hidden" onClick={() => {
                        setShowSideBar(!showSidebar)
                    }}>
                        <FontAwesomeIcon className={`text-citrus-rose transition-all duration-200 ${showSidebar ? "rotate-90 scale-110" : "rotate-0 scale-100"}`} icon={showSidebar ? faXmark : faBars} />
                    </button>
                    <img className="w-17 cursor-pointer" src={logo} onClick={() => navigate("/home")}/>
                </div>
                <UserNav user={user} />
            </div>
            <div className="w-full h-full px-2 flex flex-row gap-2 relative overflow-hidden">
                <SideBar showSidebar={showSidebar} setShowSidebar={setShowSideBar}/>
                <ProfileSection user={user} />
            </div>
        </div>
    )
}