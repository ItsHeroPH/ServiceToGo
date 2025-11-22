import { AnimatePresence, motion } from "framer-motion";
import logo1 from "../assets/logo.png";
import logo2 from "../assets/logo2.png"
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import api from "../util/api";
import { faAddressBook, faCheck, faEye, faEyeSlash, faLock, faSpinner, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useLogger } from "../provider/LoggerProvider";

export default function Register() {
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
                        page == 1 && 
                        <motion.div 
                            key="page1"
                            initial={{ x: "-50%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            exit={{ x: "50%", opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <GetStarted onNext={() => setPage(2)}/>
                        </motion.div>
                    }
                    {
                        page == 2 && 
                        <motion.div 
                            key="page2"
                            initial={{ x: "-50%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            exit={{ x: "50%", opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <Email onNext={(data) => {
                                setPage(3)
                                setData((prev) => ({...prev, ...data}))
                            }}/>
                        </motion.div>
                    }
                    {
                        page == 3 && 
                        <motion.div 
                            key="page3"
                            initial={{ x: "-50%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            exit={{ x: "50%", opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <Verify email={data["email"]} onNext={(data) => {
                                setPage(4)
                                setData((prev) => ({...prev, ...data}))
                            }}/>
                        </motion.div>
                    }
                    {
                        page == 4 && 
                        <motion.div 
                            key="page4"
                            initial={{ x: "-50%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            exit={{ x: "50%", opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <Password onNext={(data) => {
                                setPage(5)
                                setData((prev) => ({...prev, ...data}))
                            }}/>
                        </motion.div>
                    }
                    {
                        page == 5 && 
                        <motion.div 
                            key="page5"
                            initial={{ x: "-50%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            exit={{ x: "50%", opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <Info onNext={async(info) => {
                                setPage(6)
                                setData((prev) => ({...prev, ...info}))
                                const register = await api.post("/register", {...data, ...info});
                                if(register.status == 201) {
                                    const login = await api.post("/login", { user: data["email"], password: data["password"], code: data["code"] });
                                    if(login.status == 200) return navigate("/");
                                }
                            }}/>
                        </motion.div>
                    }
                    {
                        page == 6 && (
                            <motion.div
                                key="page6"
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

function GetStarted({ onNext = ({}) => {}}) {
    const navigate = useNavigate();

    return (
        <form className="flex flex-col gap-5" onSubmit={(e) => {
            e.preventDefault();
        }}>
            <h1 className="text-citrus-rose text-2xl font-bold">Register Now</h1>
            <p className="text-gray-500 font-semibold">Register now to start browsing services that you interested.</p>
            <button className="bg-citrus-rose cursor-pointer pointer-events-auto w-fit rounded-lg px-3 py-1.5 select-none text-white font-semibold" onClick={onNext}>
                Register
            </button>
            <p className="text-gray-400 text-sm font-semibold">Already have an account? <span className="text-citrus-rose font-bold cursor-pointer" onClick={() => navigate("/login")}>Login</span></p>
        </form>
    )
}

function Email({ onNext = ({}) => {} }) {
    const logger = useLogger();
    const userInput = useRef();
    const [email, setEmail] = useState("");
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, startLoading] = useTransition();

    return (
        <form className="flex flex-col gap-5" onChange={(e) => {
            const field = e.target.name;
            const value = e.target.value;
            logger.debug(`{ \"${field}\": \"${value}\" }`);

            if(field == "email") {
                startLoading(async() => {
                    setEmail(value)
                    if(value.length > 0) {
                        if(/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
                            const response = await api.get(`/user/${value}`);
                            if(response.status == 409) {
                                setHasError("Email is already exist");
                            } else {
                                setHasError(false);
                            }
                        } else {
                            setHasError(true);
                            setError("Please enter a valid email.");
                        }
                    } else {
                        setHasError(false)
                    }
                })
            }
        }} onSubmit={(e) => {
            e.preventDefault();
            startLoading(async() => {
                const response = await api.post("/verify/send-code", { email });
                if(response.status == 200) {
                    onNext({ email });
                } else {
                    setHasError(true);
                    setError("Unable to send verification code.")
                }
            })
        }}>
            <h1 className="text-citrus-rose text-2xl font-bold">Email</h1>
            <p className="text-gray-500 font-semibold">Please enter your email.</p>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    userInput.current.focus();
                }}
            >
                <FontAwesomeIcon className="text-gray-400" icon={faEnvelope} />
                <input ref={userInput} className="w-full text-gray-400 text-md outline-none font-semibold" placeholder="Email" name="email"/>
                {
                    email.length > 0 && !hasError && <FontAwesomeIcon className="text-green-400" icon={faCheck}/>
                }
            </div>
            <div className="flex flex-col">
                <button className={`${isLoading || (email.length == 0 || hasError) ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} w-fit rounded-lg px-3 py-1.5 select-none text-white font-semibold`}>
                    Next
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

function Verify({ email = "", onNext = () => {} }) {
    const logger = useLogger();
    const codeInput = useRef();
    const [code, setCode] = useState("");
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, startLoading] = useTransition();
    return (
        <form className="flex flex-col gap-5"  onChange={(e) => {
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
                <input ref={codeInput} className="w-full text-gray-400 text-md outline-none font-semibold" placeholder="Code" maxLength={6} name="code"/>
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

function Password({ onNext = ({}) => {}}) {
    const logger = useLogger();
    const pass1Input = useRef();
    const pass2Input = useRef();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [hasError, setHasError] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, startLoading] = useTransition();

    const hasMinLength = password.length >= 8;
    const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
    const hasSymbol = /[!@#$%^&*()_\-+=<>?{}[\]~]/.test(password);

    return (
        <form className="flex flex-col gap-5" onChange={(e) => {
            const field = e.target.name;
            const value = e.target.value;
            logger.debug(`{ \"${field}\": \"${value}\" }`);

            if(field == "password") {
                setPassword(value);
            } else if(field == "confirm") {
                setConfirmPassword(value);
                if(value === password) {
                    setHasError(false);
                } else {
                    setHasError(true);
                    setError("Password doesn't match.");
                }
            }
        }} onSubmit={(e) => {
            e.preventDefault();
            onNext({ password });
        }}>
            <h1 className="text-citrus-rose text-2xl font-bold">Create Password</h1>
            <ul className="text-xs">
                <li className={hasMinLength ? "text-green-500 line-through" : "text-rose-400"}>- At least eight characters.</li>
                <li className={hasUpperLower ? "text-green-500 line-through" : "text-rose-400"}>- At least one upper and lower case letter.</li>
                <li className={hasSymbol ? "text-green-500  line-through" : "text-rose-400"}>- At least one symbols.</li>
            </ul>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    pass1Input.current.focus();
                }}
            >
                <FontAwesomeIcon className="text-gray-400" icon={faLock} />
                <input ref={pass1Input} className="w-full text-gray-400 text-md outline-none font-semibold" type={showPassword1 ? "text" : "password"} placeholder="Create Password" name="password"/>
                <FontAwesomeIcon className="text-gray-400 cursor-pointer" icon={showPassword1 ? faEye : faEyeSlash} onClick={() => setShowPassword1((prev) => !prev)}/>
            </div>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    pass2Input.current.focus();
                }}
            >
                <FontAwesomeIcon className="text-gray-400" icon={faLock} />
                <input ref={pass2Input} className="w-full text-gray-400 text-md outline-none font-semibold" type={showPassword2 ? "text" : "password"} placeholder="Confirm Password" name="confirm"/>
                <FontAwesomeIcon className="text-gray-400 cursor-pointer" icon={showPassword2 ? faEye : faEyeSlash} onClick={() => setShowPassword2((prev) => !prev)}/>
            </div>
            <div className="flex flex-col">
                <button className={`${isLoading || hasError ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} w-fit rounded-lg px-3 py-1.5 select-none text-white font-semibold`}>
                    Confirm
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

function Info({ onNext = ({}) => {}}) {
    const logger = useLogger();
    const nameInput = useRef();
    const usernameInput = useRef();
    
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");

    const [validUsername, setValidUsername] = useState("");
    const [isUsernameGenerated, setIsUsernameGenerated] = useState(false);
    const [isLoading, startLoading] = useTransition();

    useEffect(() => {
        setUsername(name.replaceAll(" ", ".").replaceAll("\_", "."));
        setIsUsernameGenerated(true);
    }, [name])

    useEffect(() => {
        if(!username) {
            setValidUsername(false);
            return;
        }
        logger.debug(`{ \"username\": \"${username}\" }`);
        startLoading(async() => {
            const response = await api.get(`/user/${username}`)
            if(response.status == 404) {
                setValidUsername(true);
            } else {
                if(isUsernameGenerated) {
                    setUsername(name.replaceAll(" ", ".").replaceAll("\_", ".") + Math.floor((100 * Math.random()) * 1000))
                } else {
                    setValidUsername(false);
                }
            }
        })
    }, [username])
    return (
        <form className="flex flex-col gap-5" onChange={(e) => {
            const field = e.target.name;
            const value = e.target.value;
            logger.debug(`{ \"${field}\": \"${value}\" }`);

            if(field == "name") {
                setName(value);
            } else if(field == "username") {
                setIsUsernameGenerated(false);
                setUsername(value);
            }
        }} onSubmit={(e) => {
            e.preventDefault();
            onNext({ name, username, gender })
        }}>
            <h1 className="text-citrus-rose text-2xl font-bold">Information</h1>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    nameInput.current.focus();
                }}
            >
                <FontAwesomeIcon className="text-gray-400" icon={faAddressBook}/>
                <input ref={nameInput} className="w-full text-gray-400 text-md outline-none font-semibold" placeholder="Your Name" defaultValue={name} name="name"/>
            </div>
            <div className="bg-transparent w-full flex flex-row justify-between items-center gap-2 outline-2 outline-gray-400 px-3 py-1.5 rounded-lg cursor-text"
                onClick={() => {
                    usernameInput.current.focus();
                }}
            >
                <FontAwesomeIcon className="text-gray-400" icon={faUser}/>
                <input ref={usernameInput} className="w-full text-gray-400 text-md outline-none font-semibold" placeholder="Your Name" value={username} name="username"/>
                {
                    validUsername ? <FontAwesomeIcon className="text-green-500" icon={faCheck}/> : <FontAwesomeIcon className="text-rose-500" icon={faXmark}/>
                }
            </div>
            <div className="flex flex-col gap-3">
                <label className="text-gray-400 font-semibold">Gender</label>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-row gap-1 cursor-pointer" onClick={() => setGender("male")}>
                        <input className="w-5 accent-rose-500 cursor-pointer" type="radio" checked={gender === "male"} defaultChecked={false} name="gender"/>
                        <label className="text-sm text-gray-500 font-medium cursor-pointer">Male</label>
                    </div>
                    <div className="flex flex-row gap-1 cursor-pointer" onClick={() => setGender("female")}>
                        <input className="w-5 accent-rose-500 cursor-pointer" type="radio" checked={gender === "female"} defaultChecked={false}  name="gender"/>
                        <label className="text-sm text-gray-500 font-medium cursor-pointer">Female</label>
                    </div>
                    <div className="flex flex-row gap-1 cursor-pointer" onClick={() => setGender("other")}>
                        <input className="w-5 accent-rose-500 cursor-pointer" type="radio" checked={gender === "other"} defaultChecked={false}  name="gender"/>
                        <label className="text-sm text-gray-500 font-medium cursor-pointer">Other</label>
                    </div>
                </div>
            </div>
            <button className={`${isLoading || !validUsername || !gender ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} w-fit rounded-lg px-3 py-1.5 select-none text-white font-semibold`}>
                Complete
            </button>
        </form>   
    )
}