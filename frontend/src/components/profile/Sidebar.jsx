import { useLoaderData } from "react-router-dom";
import profile from "../../assets/blank_profile.png";

export default function SideBar({ showSidebar, setShowSidebar }) {
    const { user } = useLoaderData();
    return (
        <>
            <div className={`bg-black w-full h-full absolute lg:hidden z-20 top-0 left-0 right-0 bottom-0 transition-all duration-300 ${showSidebar ? "opacity-25 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setShowSidebar(false)}></div>
            <div className={`bg-citrus-peach-light min-w-80 max-w-80 h-full shadow-xl rounded-lg flex flex-col items-center absolute lg:static top-0 left-0 z-40 transform transition-transform duration-300 overflow-y-scroll no-scrollbar
                ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <div className="flex flex-row self-start items-center gap-4 p-5">
                    <img className="w-15 rounded-full" src={user.avatar ? user.avatar : profile}/>
                    <div className="h-fit flex flex-col justify-center">
                        <p className="text-xl/4 text-citrus-rose font-bold">{user.name}</p>
                        <p className="text-md text-slate-500 font-semibold">@{user.username}</p>
                    </div>
                </div>
                <div className="w-[90%] h-0.5 bg-slate-400/50 my-3"></div>
                <NavItem>Profile</NavItem>
                <NavItem>Addresses</NavItem>
                <NavItem>Change Password</NavItem>
                <NavItem>My Services</NavItem>
                <NavItem>My Purchases</NavItem>
            </div>
        </>
    )
}

function NavItem({ onClick, children }) {
    return (
        <div className="w-full px-4 py-2 cursor-pointer text-lg text-citrus-pink font-semibold hover:bg-citrus-orange/10 transitiol-all duration-200">
            {children}
        </div>
    )
}