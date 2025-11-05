import { useLoaderData, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

import UserNav from "../components/UserNav";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import ChatSideBar from "../components/ChatSideBar";
import ChatRoom from "../components/ChatRoom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("/api/", { withCredentials: true });

export default function Chats() {
    const navigate = useNavigate();
    const { user, users } = useLoaderData();
    
    const [showSidebar, setShowSideBar] = useState(false);
    const [currentUser, setCurrentUser] = useState(users[0]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.emit("join_message", user.id);
    }, [user]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            if (
                (data.from === currentUser.id && data.to === user.id) ||
                (data.from === user.id && data.to === currentUser.id)
            ) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => socket.off("receive_message");
    }, [currentUser, user]);
    
    useEffect(() => {
        const fetchMessage = async () => {
            if (!currentUser) return;

            try {
                const res = await axios.get(`/api/message/${currentUser.id}`, { withCredentials: true });
                if(res.data.status == 200) setMessages(res.data.messages);
            } catch(err) {
                setMessages([])
            }
        }

        fetchMessage()
    }, [currentUser])

    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen flex flex-col gap-2">
                <div className="w-full h-fit shadow-lg py-2 px-4 flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4">
                        <button className="bg-citrus-peach-light px-2 rounded-lg cursor-pointer lg:hidden" onClick={() => {
                            setShowSideBar(!showSidebar)
                        }}>
                            <FontAwesomeIcon className="text-citrus-rose" icon={faBars} />
                        </button>
                        <img className="w-17 cursor-pointer" src={logo} onClick={() => navigate("/home")}/>
                    </div>
                    <UserNav user={user} />
                </div>
                <div className="w-full h-full flex flex-row gap-2 relative overflow-hidden">
                    <ChatSideBar users={users} showSidebar={showSidebar} onSelectUser={(u) => {
                        setCurrentUser(u)
                        setMessage("")
                        setShowSideBar(false)
                    }}/>
                    <ChatRoom user={currentUser} message={message} messages={messages} onMessageChange={(msg) => {
                        setMessage(msg)
                    }}
                        onMessageSent={async () => {
                            if(message.length > 0) {
                                socket.emit("send_message", {
                                    to: currentUser.id,
                                    from: user.id,
                                    message: message,
                                });
                                setMessage("");
                            }
                        }}/>
                </div>
            </div>
        </>
    )
}