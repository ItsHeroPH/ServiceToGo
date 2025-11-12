import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import profile from "../../assets/blank_profile.png";
import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfileSection({ user }) {
    const navigate = useNavigate()
    const uploadRef = useRef();
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar);
    const [imgPos, setImgPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const isValid = name;

    useEffect(() => {
        if (!canvasRef.current || !image) return;
        const ctx = canvasRef.current.getContext("2d");
        const canvasWidth = 300;
        const canvasHeight = 300;
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(image, imgPos.x, imgPos.y, imgPos.width, imgPos.height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const radius = 150;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fill("evenodd");
        ctx.restore();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke()
    }, [image, imgPos]);


    return (
        <div className="bg-citrus-peach-light w-full h-full py-5 px-6 rounded-lg flex flex-col">
            {
                isCropModalOpen && image && (
                    <div className="fixed bg-black/20 w-screen h-screen top-0 bottom-0 left-0 right-0 z-50 flex justify-center items-center">
                        <div className="bg-slate-200 w-70 h-85 rounded-lg shadow-xl p-5 flex flex-col gap-5 justify-center items-center"
                            onMouseMove={(e) => {
                                if (!dragging) return;
                                const rect = canvasRef.current.getBoundingClientRect();
                                let mouseX = e.clientX - rect.left;
                                let mouseY = e.clientY - rect.top;

                                setImgPos({
                                    ...imgPos,
                                    x: mouseX - offset.x,
                                    y: mouseY - offset.y,
                                });
                            }}
                            onMouseUp={(e) => {
                                setDragging(false)
                            }}
                            onTouchMove={(e) => {
                                if (!dragging) return;
                                const rect = canvasRef.current.getBoundingClientRect();
                                let touch = e.touches[0];
                                let mouseX = touch.clientX - rect.left;
                                let mouseY = touch.clientY - rect.top;

                                setImgPos({
                                    ...imgPos,
                                    x: mouseX - offset.x,
                                    y: mouseY - offset.y,
                                });
                            }}
                            onTouchEnd={(e) => {
                                setDragging(false)
                            }}
                        >
                            <div className="w-full flex flex-row justify-between items-center">
                                <h1 className="text-lg text-citrus-rose font-bold">Adjust your Picture</h1>
                                <button className="bg-slate-300 self-end px-2 py-1.5 rounded-full cursor-pointer text-citrus-rose transition-all duration-200 hover:bg-citrus-rose hover:text-citrus-peach-light"
                                    onClick={() => setIsCropModalOpen(false)}
                                >
                                    <FontAwesomeIcon icon={faXmark}/>
                                </button>
                            </div>
                            <canvas className="w-50" ref={canvasRef} 
                                onMouseDown={(e) => {
                                    const rect = canvasRef.current.getBoundingClientRect();
                                    const mouseX = e.clientX - rect.left;
                                    const mouseY = e.clientY - rect.top;

                                    setDragging(true);
                                    setOffset({ x: mouseX - imgPos.x, y: mouseY - imgPos.y });

                                }}
                                onTouchStart={(e) => {
                                    const rect = canvasRef.current.getBoundingClientRect();
                                    const touch = e.touches[0];
                                    const mouseX = touch.clientX - rect.left;
                                    const mouseY = touch.clientY - rect.top;

                                    setDragging(true);
                                    setOffset({ x: mouseX - imgPos.x, y: mouseY - imgPos.y });
                                }}
                            />
                            <button className={`${uploading ? "bg-citrus-rose/50 pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} select-none px-5 py-2 rounded-lg text-md text-citrus-peach-light flex flex-row items-center gap-2 font-semibold`} onClick={() => {
                                setUploading(true)
                                const cropX = (300 - 300) / 2;
                                const cropY = (300 - 300) / 2;

                                const scaleX = image.width / imgPos.width;
                                const scaleY = image.height / imgPos.height;

                                const sx = (cropX - imgPos.x) * scaleX;
                                const sy = (cropY - imgPos.y) * scaleY;
                                const sSize = 300 * scaleX;
                                const cropCanvas = document.createElement("canvas");
                                cropCanvas.width = 300;
                                cropCanvas.height = 300;
                                const ctx = cropCanvas.getContext("2d");
                                ctx.drawImage(image, sx, sy, sSize, sSize, 0, 0, 300, 300);

                                cropCanvas.toBlob(async (blob) => {
                                if (!blob) return;
                                const reader = new FileReader();
                                reader.onloadend = async () => {
                                    const base64String = reader.result.split(",")[1];
                                    try {
                                    const response = (
                                        await axios.post(
                                        `${import.meta.env.VITE_API_URL}/upload`,
                                        { data: base64String, fileType: blob.type, type: "avatar" },
                                        { withCredentials: true }
                                        )
                                    ).data;

                                    if (response.status === 200) {
                                        const avatarBlob = (
                                        await axios.get(`${import.meta.env.VITE_API_URL}/images/${response.id}`, {
                                            withCredentials: true,
                                            responseType: "blob",
                                        })
                                        ).data;
                                        setAvatar(URL.createObjectURL(avatarBlob));
                                        setIsCropModalOpen(false);
                                        setUploading(false);
                                        navigate("/me/profile", { replace: true });
                                    }
                                    } catch (err) {
                                    console.error(err);
                                    }
                                };
                                reader.readAsDataURL(blob);
                                }, "image/jpeg");
                            }}>
                                Save
                            </button>
                        </div>
                    </div>
                )
            }
            <h1 className="text-xl text-citrus-rose font-bold">My Profile</h1>
            <p className="text-md text-slate-500 font-semibold">Manage your account</p>
            <div className="w-full h-0.5 bg-slate-400/50 my-3"></div>
            <div className="flex flex-col-reverse md:flex-row gap-5">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center">
                        <label className="text-md text-citrus-orange font-semibold">Email:</label>
                        <p className="text-md text-citrus-pink font-semibold">{user.email.substring(0, 2) + "*".repeat(user.email.indexOf("@") - 4) + user.email.substring(user.email.indexOf("@") - 2, user.email.indexOf("@")) + "@gmail.com"}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <label className="text-md text-citrus-orange font-semibold">Username:</label>
                        <p className="text-md text-citrus-pink font-semibold">@{user.username}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <label className="text-md text-citrus-orange font-semibold">Name:</label>
                        <input className="bg-slate-100 w-full md:w-[60%] h-10 px-3 rounded-lg outline-none text-md text-citrus-pink font-semibold"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name" value={name}
                        />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <label className="text-md text-citrus-orange font-semibold">Date of Birth:</label>
                        <p className="text-md text-citrus-pink font-semibold">{user.birthday}</p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <button className={`${saving ? "bg-citrus-rose pointer-events-none" : "bg-citrus-rose cursor-pointer pointer-events-auto"} select-none w-25 px-5 py-2 rounded-lg flex flex-row gap-2 justify-center items-center text-md text-citrus-peach-light font-semibold`}
                            onClick={async() => {
                                if(isValid) {
                                    setSaving(true)
                                    const response = (await axios.post(`${import.meta.env.VITE_API_URL}/user/edit`, { name }, { withCredentials: true })).data;
                                    if(response.status == 200) {
                                        setSaving(false)
                                        navigate("/me/profile", { replace: true })
                                    }
                                }
                            }}
                        >
                            Saving
                        </button>
                        <button className="select-none w-40 px-5 py-2 rounded-lg bg-transparent text-citrus-rose outline outline-citrus-rose text-md font-semibold cursor-pointer"
                            onClick={async() => {
                                const response = (await axios.get(`${import.meta.env.VITE_API_URL}/user/delete`, { withCredentials: true })).data;
                                if(response.status === 200) return navigate("/login");
                            }}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
                <div className="min-w-50 flex flex-col justify-center items-center gap-2">
                    <img className="w-30 rounded-full" src={avatar ? avatar : profile} onClick={() => uploadRef.current.click()}/>
                    <button className="select-none bg-citrus-rose px-5 py-2 rounded-lg text-md text-citrus-peach-light font-semibold cursor-pointer"
                        onClick={() => uploadRef.current.click()}
                    >
                        Select Image
                    </button>
                    <div className="text-center text-sm text-slate-500 font-semibold">
                        <p>File size: maximum 2MB</p>
                        <p>File extension: .JPEG, .PNG</p>
                    </div>
                    <input ref={uploadRef} className="hidden" type="file" accept="image/png, image/jpeg" slot="1"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if(!file) return;
                            if(!["image/png", "image/jpeg"].includes(file.type)) return;
                            if(file.size > 2 * 1024 * 1024) return;
                            
                            const img = new Image();
                            img.src = URL.createObjectURL(file);
                            img.onload = () => {
                                setImage(img)
                                const scale = Math.max(300 / img.width, 300 / img.height);
                                setImgPos({
                                    x: (300 - img.width * scale) / 2,
                                    y: (300 - img.height * scale) / 2,
                                    width: img.width * scale,
                                    height: img.height * scale,
                                });
                            };
                            setIsCropModalOpen(true)
                            uploadRef.current.value = ""
                        }}
                    />
                </div>
            </div>
        </div>
    )
}