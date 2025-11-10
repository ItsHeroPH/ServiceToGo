import { useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";

import Email from "../components/passwordreset/Email";
import Verify from "../components/passwordreset/Verify";
import Password from "../components/signup/Password";
import Done from "../components/passwordreset/Done";

export default function PasswordReset() {
    const [data, setData] = useState({});
    const [page, setPage] = useState(1);

    function handleChange(data) {
        setData((prev) => ({...prev, ...data }))
    }

    return (
        <div className="bg-citrus-rose w-screen h-screen overflow-y-scroll no-scrollbar p-5 flex flex-col items-center space-y-6">
            <img className="w-52" src={logo}/>
            <div className="bg-citrus-peach-light w-80 rounded-xl shadow-xl px-5 py-6 flex flex-col gap-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <h1 className="text-xl text-citrus-rose font-bold cursor-default">Reset Password</h1>
                {
                    page == 1 ? (
                        <Email onNext={async (e) => {
                            setPage((prev) => prev + 1);
                            handleChange(e);
                            await axios.post(`${import.meta.env.VITE_API_URL}/send-code`, { email: e.email }, { withCredentials: true });
                        }}/>
                    ) : page == 2 ? (
                        <Verify email={data.email} onNext={(e) => {
                            setPage((prev) => prev + 1)
                            handleChange(e)
                        }} />
                    ) : page == 3 ? (
                        <Password onNext={(e) => {
                            setPage((prev) => prev + 1);
                            handleChange(e);
                        }} />
                    ) : (
                        <Done data={data}/>
                    )
                }
            </div>
        </div>
    )
}