import axios from "axios";
import { useRef } from "react";
import { useState } from "react";

export default function Verify({ email, onNext = ({}) => {}}) {
    const input = useRef();
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-500">We sent you a 6-digits Verification Code to your email.</p>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Verification Code</label>
                <input ref={input} className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="text" maxLength={6} onChange={(e) => {
                    if(hasError) setHasError(false);
                }} placeholder="Code"/>
                {
                    hasError && (
                        <label className="block text-sm font-semibold text-citrus-rose">{error}</label>
                    )
                }
            </div>
            <button className={`${isLoading && input.current.value < 6 ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} select-none w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                onClick={async() => {
                    setIsLoading(true);
                    const code = input.current.value;
                    const response = (await axios.post(`${import.meta.env.VITE_API_URL}/verify`, { email, code, remove: false }, { withCredentials: true })).data;
                    if(response.status == 200) {
                        onNext({ code });
                    } else {
                        setIsLoading(false);
                        setHasError(true);
                        setError(response.message);
                    }
                }}
            >
                Verify
            </button>
            <div className="select-none text-sm text-citrus-rose font-bold cursor-pointer hover:underline" onClick={async () => {
                await axios.post(`${import.meta.env.VITE_API_URL}/send-code`, { email }, { withCredentials: true });
            }}>Resend Code</div>
        </div>
    )
}