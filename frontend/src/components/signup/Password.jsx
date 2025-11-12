import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Password({ onNext = ({}) => {}}) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");

    const hasMinLength = password.length >= 8;
    const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
    const hasSymbol = /[!@#$%^&*()_\-+=<>?{}[\]~]/.test(password);
    const passwordsMatch = confirmPassword && confirmPassword === password;

    return (
        <div className="flex flex-col gap-3">
            <div>
                <p className="text-sm text-slate-600 font-bold">Your password must be:</p>
                <ul className="text-xs">
                    <li className={hasMinLength ? "text-citrus-green line-through" : "text-citrus-crimson"}>- At least eight characters.</li>
                    <li className={hasUpperLower ? "text-citrus-green line-through" : "text-citrus-crimson"}>- At least one upper and lower case letter.</li>
                    <li className={hasSymbol ? "text-citrus-green line-through" : "text-citrus-crimson"}>- At least one symbols.</li>
                </ul>
            </div>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Password</label>
                <div className="bg-slate-200 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center gap-2">
                    <input className="w-full outline-none text-md text-citrus-pink font-semibold" type={showPassword1 ? "text" : "password"} onChange={(e) => {
                        setPassword(e.target.value)
                    }} placeholder="Password"/>
                    <FontAwesomeIcon className="text-citrus-pink cursor-pointer" icon={showPassword1 ? faEye : faEyeSlash} onClick={() => setShowPassword1((prev) => !prev)}/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Confirm Password</label>
                <div className="bg-slate-200 w-full px-3 py-1.5 rounded-lg flex flex-row justify-between items-center gap-2">
                    <input className="w-full outline-none text-md text-citrus-pink font-semibold" type={showPassword2 ? "text" : "password"} onChange={(e) => {
                        setConfirmPassword(e.target.value)
                    }} placeholder="Password"/>
                    <FontAwesomeIcon className="text-citrus-pink cursor-pointer" icon={showPassword2 ? faEye : faEyeSlash} onClick={() => setShowPassword2((prev) => !prev)}/>
                </div>
            </div>
            {
                hasError && (
                    <label className="block text-sm font-semibold text-citrus-rose">{error}</label>
                )
            }
            <button className="bg-citrus-rose w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg"
                onClick={() => {
                    if(hasMinLength && hasUpperLower && hasSymbol) {
                        if(passwordsMatch) {
                            setHasError(false)
                            onNext({ password })
                        } else {
                            setError("Your password is not matched.");
                            setHasError(true);
                        }
                    } else {
                        setError("Your password is too weak.");
                        setHasError(true);
                    }
                }}>
                Confirm Password
            </button>
        </div>
    )
}