import { useState } from "react";

export default function Info({ onNext = ({}) => {} }) {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isValid = username && name && gender && birthday;
    
    return (
        <div className="flex flex-col gap-3">
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Username</label>
                <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="text" onChange={(e) => {
                    setUsername(e.target.value)
                }} placeholder="Username"/>
            </div>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Name</label>
                <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink font-semibold" type="text" onChange={(e) => {
                    setName(e.target.value)
                }} placeholder="Full Name"/>
            </div>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Gender</label>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-1 cursor-pointer" onClick={() => setGender("male")}>
                        <input className="w-5 accent-citrus-rose cursor-pointer" type="radio" checked={gender === "male"} name="gender"/>
                        <label className="text-sm text-citrus-rose cursor-pointer">Male</label>
                    </div>
                    <div className="flex flex-row gap-1 cursor-pointer" onClick={() => setGender("female")}>
                        <input className="w-5 accent-citrus-rose outline-none cursor-pointer" type="radio" checked={gender === "female"} name="gender"/>
                        <label className="text-sm text-citrus-rose cursor-pointer">Female</label>
                    </div>
                    <div className="flex flex-row gap-1 cursor-pointer" onClick={() => setGender("other")}>
                        <input className="w-5 accent-citrus-rose outline-none cursor-pointer" type="radio" checked={gender === "other"} name="gender"/>
                        <label className="text-sm text-citrus-rose cursor-pointer">Other</label>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Date of Birth</label>
                <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink caret-citrus-pink font-semibold" type="date" max={(() => {
                    const date = new Date()
                    date.setFullYear(new Date().getFullYear() - 16);
                    return date.toISOString().split("T")[0];
                })()} onChange={(e) => {
                    setBirthday(e.target.value)
                }} placeholder="Age"/>
            </div>
            <button className={`${isValid && !isLoading ? "bg-citrus-rose cursor-pointer pointer-events-auto" : "bg-citrus-rose/50 pointer-events-none"} select-none w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                onClick={async() => {
                    setIsLoading(true)
                    onNext({
                        username,
                        name,
                        gender,
                        birthday
                    })
                }}
            >
                Next
            </button>
        </div>
    )
}