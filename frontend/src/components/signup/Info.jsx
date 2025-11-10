import { useState } from "react";

export default function Info({ onNext = ({}) => {} }) {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");

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
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-citrus-orange">Date of Birth</label>
                <input className="bg-slate-200 w-full outline-none px-3 py-1.5 rounded-lg text-md text-citrus-pink caret-citrus-pink font-semibold" type="date" max={new Date().toISOString().split("T")[0]} onChange={(e) => {
                    setBirthday(e.target.value)
                    console.log(e.target.value)
                }} placeholder="Age"/>
            </div>
            <button className={`${isValid ? "bg-citrus-rose cursor-pointer transition-all duration-500 hover:text-rose-300 hover:scale-105 hover:shadow-lg" : "bg-citrus-rose/50"} w-full rounded-lg p-1 text-lg text-citrus-peach-light font-bold`}
                onClick={async() => {
                    if(isValid) {
                        onNext({
                            username,
                            name,
                            gender,
                            birthday
                        })
                    }
                }}
            >
                Next
            </button>
        </div>
    )
}