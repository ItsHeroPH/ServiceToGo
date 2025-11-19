import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useTransition } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Done({ data }) {
    const navigate = useNavigate();
    const [isLoading, startLoading] = useTransition();

    return (
        <div className="flex flex-col gap-3 items-center">
            <div className="flex flex-col items-center">
                <FontAwesomeIcon className="text-citrus-rose" size="3x" icon={faClipboardCheck}/>
                <h1 className="text-lg text-citrus-rose font-bold">Password Reset Complete</h1>
            </div>
            <button className={`${isLoading ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`} onClick={
                () => startLoading(async () => {
                    const response = (await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, { ...data }, { withCredentials: true })).data;
                    if(response.status === 200) {
                        const login = (await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email: data.email, password: data.password }, { withCredentials: true })).data;
                        if(login.status === 200) {
                            return navigate("/home");
                        }
                    }
                })
            }>
                Sign In
            </button>
        </div>
    )
}