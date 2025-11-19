import axios from "axios";
import { useTransition } from "react";
import { useState } from "react";

export default function Email({ onNext = ({}) => {}}) {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, startLoading] = useTransition();

    return (
        <div className="flex flex-col gap-3">
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Email</label>
                <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="email" onChange={(e) => {
                    const email = e.target.value;
                    if(email.length > 0) {
                        if(/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
                            setIsValid(true)
                            setHasError(false)
                        } else {
                            setIsValid(false)
                            setHasError(true)
                            setError("You've enter an invalid email.")
                        }
                    } else {
                        setIsValid(false)
                        setHasError(false)
                    }
                    setEmail(email)
                }} placeholder="Email" value={email}/>
                {
                    hasError && (
                        <label className="block text-sm font-semibold text-citrus-rose">{error}</label>
                    )
                }
            </div>
            <button className={`${isValid && !isLoading ? "bg-citrus-rose cursor-pointer pointer-events-auto" : "bg-citrus-rose/50 pointer-events-none"} select-none w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                onClick={() => startLoading(async() => {
                    const response = (await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email }, { withCredentials: true })).data;

                    if(response.status == 422) {
                        onNext({ email })
                    } else {
                        setHasError(true)
                        setError("You've enter an existing email.")
                    }
                })}
            >
                Next
            </button>
        </div>
    )
}
