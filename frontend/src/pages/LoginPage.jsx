import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo1 from "../assets/logo.png";
import logo2 from "../assets/logo2.png"
import { useRef } from "react";
import { useState } from "react";
import { faEye, faUser, faEyeSlash, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import { useLogger } from "../provider/LoggerProvider";

export default function LoginPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [data, setData] = useState({});

    return (
        <div className="bg-citrus-rose w-screen h-screen flex flex-col justify-between items-center md:flex-row">
            <img className="w-70 md:hidden" src={logo1}/>
            <div className="bg-gray-100 w-screen md:w-sm h-100 md:h-screen p-5 rounded-t-2xl md:rounded-t-none md:rounded-r-2xl flex flex-col gap-5 overflow-hidden">
                <img className="w-40 hidden md:block self-center" src={logo2} />
                <AnimatePresence mode="wait">
                    {
                        page == 1 && (
                            <motion.div
                                key="page1"
                                initial={{ x: "-50%", opacity: 0 }}
                                animate={{ x: "0%", opacity: 1 }}
                                exit={{ x: "50%", opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                <Login  onNext={(e) => {
                                    setPage(2)
                                    setData((prev) => ({...prev, ...e}));
                                }}/>
                            </motion.div>
                        )
                    }
                    {
                        page == 2 && (
                            <motion.div
                                key="page2"
                                initial={{ x: "-50%", opacity: 0 }}
                                animate={{ x: "0%", opacity: 1 }}
                                exit={{ x: "50%", opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                <Verify email={data["email"]} onNext={async(e) => {
                                    setPage(3) 
                                    const response = await api.post("/login", { user: data.email, password: data.password, code: e.code });
                                    if(response.status == 200) {
                                        navigate("/")
                                    }
                                }}/>
                            </motion.div>
                        )
                    }
                    {
                        page == 3 && (
                            <motion.div
                                key="page3"
                                initial={{ x: "-50%", opacity: 0 }}
                                animate={{ x: "0%", opacity: 1 }}
                                exit={{ x: "50%", opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="w-full h-full flex justify-center items-center"
                            >
                                <FontAwesomeIcon className="animate-spin text-gray-500" size="2xl" icon={faSpinner}/>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}

function Login({ onNext = () => {} }) {
    const logger = useLogger();
    const navigate = useNavigate();
    const userInput = useRef();
    const passInput = useRef();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, startLoading] = useTransition();

    return (
        <form className="flex flex-col gap-5" onChange={(e) => {
            setHasError(false)

            const field = e.target.name;
            const value = e.target.value;

            logger.debug(`{ \"${field}\": \"${value}\" }`);

            if(field === "user") {
                setUser(value);
                if(value.length > 0) {
                    startLoading(async() => {
                        const response = await api.get(`/user/${value}`)
                        if(response.status == 404) {
                            setError("Username or Email doesn't exist!");
                            setHasError(true)
                        }
                    })
                }
            } else if(field === "password") {
                setPassword(value)
            }
        }} onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            logger.debug(JSON.stringify(data));
            startLoading(async() => {
                const response = await api.post("/login", data);
                if(response.status == 402) {
                    onNext({ email: response.email, password: password })
                } else {
                    setHasError(true)
                    setError(response.message)
                }
            })
        }}>
            <h1 className="text-citrus-rose text-2xl font-bold">Hello,<br/>Wellcome Back!</h1>
            <p className="text-gray-500 font-semibold">Hey, wellcome back to ServiceToGo</p>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    userInput.current.focus();
                }}
            >
                <FontAwesomeIcon className="text-gray-400" icon={faUser} />
                <input ref={userInput} className="w-full text-gray-400 text-md outline-none font-semibold" placeholder="Email or Username" name="user"/>
            </div>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    passInput.current.focus();
                }}
            >
                <FontAwesomeIcon className="text-gray-400" icon={faLock} />
                <input ref={passInput} className="w-full text-gray-400 text-md outline-none font-semibold" type={showPassword ? "text" : "password"} placeholder="Password" name="password"/>
                <FontAwesomeIcon className="text-gray-400 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword((prev) => !prev)}/>
            </div>
            <div className="flex flex-col">
                <button className={`${isLoading ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} w-fit rounded-lg px-3 py-1.5 select-none text-white font-semibold`}>
                    Login
                </button>
                {
                    hasError && (
                        <label className="text-citrus-rose text-sm font-medium">{error}</label>
                    )
                }
            </div>
            <p className="text-gray-400 text-sm font-semibold">Don't have an account? <span className="text-citrus-rose font-bold cursor-pointer" onClick={() => navigate("/register")}>Create New</span></p>
        </form>
    )
}

function Verify({ email = "", onNext = () => {} }) {
    const logger = useLogger();
    const codeInput = useRef();
    const [code, setCode] = useState("");
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, startLoading] = useTransition();
    return (
        <form className="flex flex-col gap-5" onChange={(e) => {
            const name = e.target.name;
            const value = e.target.value;
            logger.debug(`{ \"${name}\": \"${value}\" }`);

            if(name == "code") {
                if(!isNaN(value)) {
                    setHasError(false)
                    setCode(value)
                }
            }
        }} onSubmit={(e) => {
            e.preventDefault();
            startLoading(async () => {
                const response = await api.post("/verify", { email, code, remove: false });
                if(response.status == 200) {
                    onNext({ code })
                } else {
                    setHasError(true);
                    setError(response.message);
                }
            })
        }}>
            <h1 className="text-citrus-rose text-2xl font-bold">Verification</h1>
            <p className="text-gray-500 font-semibold">We sent you a 6-digit verification code to your email. Kindly check your email.</p>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    codeInput.current.focus();
                }}
            >
                <input ref={codeInput} className="w-full text-gray-400 text-md outline-none font-semibold" placeholder="Code" maxLength={6} value={code} name="code"/>
            </div>
            <div className="flex flex-col">
                <button className={`${isLoading ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} w-fit rounded-lg px-3 py-1.5 select-none text-white font-semibold`}>
                    Verify
                </button>
                {
                    hasError && (
                        <label className="text-citrus-rose text-sm font-medium">{error}</label>
                    )
                }
            </div>
        </form>
    )
}