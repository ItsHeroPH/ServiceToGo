import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Done({ data }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-3 items-center">
            <div className="flex flex-col items-center">
                <FontAwesomeIcon className="text-citrus-rose" size="3x" icon={faClipboardCheck}/>
                <h1 className="text-lg text-citrus-rose font-bold">Register Complete!</h1>
            </div>
            <button className="bg-citrus-rose w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg" onClick={async() => {
                const response = (await axios.post(`${import.meta.env.VITE_API_URL}/register`, { ...data }, { withCredentials: true })).data;
                if(response.status === 201) {
                    const login = (await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email: data.email, password: data.password }, { withCredentials: true })).data;
                    if(login.status === 200) return navigate("/home");
                }
            }}>
                Sign In
            </button>
        </div>
    )
}