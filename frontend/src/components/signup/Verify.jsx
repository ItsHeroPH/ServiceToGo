import axios from "axios";
import { useEffect, useRef } from "react";
import { useState } from "react";

export default function Verify({ email, onNext = ({}) => {}}) {
    const input = useRef();
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");

    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-500">We sent you a 6-digits OTP to your email.</p>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Verification Code</label>
                <input ref={input} className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="text" maxLength={6} onChange={(e) => {
                    if(hasError) setHasError(false);
                }} placeholder="Code"/>
                {
                    hasError ? (
                        <label className="block text-sm font-semibold text-citrus-rose">{error}</label>
                    ) : (<></>)
                }
            </div>
            <button className="bg-citrus-rose w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg"
                onClick={async() => {
                    const code = input.current.value;
                    if(code.length === 6) {
                        const response = (await axios.post(`${import.meta.env.VITE_API_URL}/register/verify`, { email, code }, { withCredentials: true })).data;
                        if(response.status == 200) {
                            onNext()
                        } else {
                            setHasError(true)
                            setError(response.message)
                        }
                    } else {
                        setHasError(true);
                        setError("Please enter a valid 6-digits code.")
                    }
                }}
            >
                Verify
            </button>
            <div className="text-sm text-citrus-rose font-bold cursor-pointer hover:underline" onClick={async () => {
                await axios.post(`${import.meta.env.VITE_API_URL}/register/send-code`, { email }, { withCredentials: true })
            }}>Resend Code</div>
        </div>
    )
}