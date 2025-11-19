import axios from "axios";
import { useEffect, useState } from "react"
import { useLoaderData } from "react-router-dom";
import Password from "../signup/Password";
import Verify from "../passwordreset/Verify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTransition } from "react";

export default function PasswordSection() {
    const { user } = useLoaderData();
    const [isSuccess, setIsSuccess] = useState(false);
    const [data, setData] = useState({});
    const [isLoading, startLoading] = useTransition();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setData({ email: user.email })
    }, [user])

    function handleChange(data) {
        setData((prev) => ({...prev, ...data}))
    }

    return (
        <div className="bg-citrus-peach-light w-full h-full py-5 px-6 rounded-lg flex flex-col">
            <h1 className="text-xl text-citrus-rose font-bold">Password</h1>
            <p className="text-md text-slate-500 font-semibold">Manage your account password</p>
            <div className="w-full h-0.5 bg-slate-400/50 my-3"></div>
            <div className="max-w-90 flex flex-col gap-4">
                {
                    isSuccess && (
                        <div className="bg-slate-200 p-2 flex flex-row gap-2 justify-between items-center rounded-lg shadow-lg">
                            <p className="text-sm text-citrus-rose font-semibold">You successfully changed your password.</p>
                            <button className="bg-slate-300 px-2 py-1 rounded-full cursor-pointer text-citrus-rose transition-all duration-200 hover:bg-citrus-rose hover:text-citrus-peach-light" onClick={() => setIsSuccess(false)}>
                                <FontAwesomeIcon size="sm" icon={faXmark}/>
                            </button>
                        </div>
                    )
                }
                {
                    progress == 0 && (
                        <button className={`${isLoading ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} select-none w-fit px-5 py-2 rounded-lg text-md text-citrus-peach-light font-semibold`}
                        onClick={() => startLoading(async () => {
                            const response = (await axios.post(`${import.meta.env.VITE_API_URL}/send-code`, { email: user.email }, { withCredentials: true })).data;
                            if(response.status == 200) {
                                setProgress(1)
                            }
                        })}
                    >
                        Change Password
                    </button>
                    )
                }
                {
                    progress == 1 && (
                        <Verify email={user.email} onNext={(e) => {
                            setProgress(2)
                            handleChange(e)
                        }}/>
                    )
                }
                {
                    progress == 2 && (
                        <Password onNext={(e) => startLoading(async () => {
                            handleChange(e)
                            const response = (await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, { ...data }, { withCredentials: true })).data;
                            if(response.status === 200) {
                                setProgress(0)
                                setIsSuccess(true)
                                setData({ email: user.email })
                        }
                        })}/>
                    )
                }
            </div>
        </div>
    )
}