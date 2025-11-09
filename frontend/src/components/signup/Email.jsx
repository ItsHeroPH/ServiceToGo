import axios from "axios";
import { useState } from "react";

export default function Email({ onNext = ({}) => {}}) {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");

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
                    hasError ? (
                        <label className="block text-sm font-semibold text-citrus-rose">{error}</label>
                    ) : (<></>)
                }
            </div>
            <button className={`${isValid ? "bg-citrus-rose cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg" : "bg-citrus-rose/50"} w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                onClick={async() => {
                    if(isValid) {
                        const response = (await axios.post(`${import.meta.env.VITE_API_URL}/register/check-email`, { email }, { withCredentials: true })).data;

                        if(response.status == 200) {
                            onNext({ email })
                        } else {
                            setHasError(true)
                            setError("You've enter an existing email.")
                        }
                    }
                }}
            >
                Next
            </button>
        </div>
    )
}
