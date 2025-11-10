import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Page404() {
    const navigate = useNavigate();
    return (
        <div className="bg-citrus-rose w-screen h-screen flex flex-col justify-center items-center">
            <div className="flex flex-row gap-2 justify-center items-center">
                <img className="w-50" src={logo}/>
                <div className="text-center">
                    <h1 className="text-8xl text-citrus-peach-light font-bold">404</h1>
                    <h1 className="text-2xl text-citrus-peach-light font-bold">Page Not Found</h1>
                </div>
            </div>
            <p className="text-md text-citrus-peach-light my-10 font-semibold">There's nothing for us to show you here!</p>
            <button className="bg-citrus-peach-light px-5 py-2 rounded-lg text-md text-citrus-pink font-bold transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg" onClick={() => navigate("/home")}>Back To Homepage</button>
        </div>
    )
}