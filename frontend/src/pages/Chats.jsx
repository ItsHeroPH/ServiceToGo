import { useLoaderData, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

import UserNav from "../components/UserNav";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import ChatSideBar from "../components/ChatSideBar";
import ChatRoom from "../components/ChatRoom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("/", { withCredentials: true });

export default function Chats() {
    const navigate = useNavigate();
    const { user, users } = useLoaderData();
    
    const [showSidebar, setShowSideBar] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});
    const [latestMessages, setLatestMessages] = useState({});
    const [usersList, setUsersList] = useState(users);

    const handleNewMessage = (data) => {
        const userId = data.from === user.id ? data.to : data.from;
        setMessages((prev) => ({...prev, [userId]: [...(prev[userId] || []), data]}));
        setLatestMessages((prev) => ({...prev, [userId]: data }));
        setUsersList((prev) => {
            const activeUser = prev.find((u) => u.id === userId);
            if (!activeUser) return prev;
            const otherUsers = prev.filter((u) => u.id !== userId);
            return [activeUser, ...otherUsers];
        });
    };

    useEffect(() => {
        const fetchAllMessage = async () => {
             const messagePromises = users.map(async (u) => {
                const res = await axios.get(`/api/message/${u.id}`, { withCredentials: true });
                if (res.data.status === 200) {
                    const sorted = [...res.data.messages].sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );
                    return { userId: u.id, messages: sorted };
                } else {
                    return { userId: u.id, messages: [] };
                }
            });

            const results = await Promise.all(messagePromises);

            const msgMap = {};
            const latestMap = {};

            results.forEach((r) => {
                msgMap[r.userId] = r.messages;
                if (r.messages.length > 0) {
                    latestMap[r.userId] = r.messages[r.messages.length - 1];
                }
            })

            const sortedUsers = users.sort((a, b) => {
                const aTime = latestMap[a.id]?.createdAt ? new Date(latestMap[a.id].createdAt).getTime() : 0;
                const bTime = latestMap[b.id]?.createdAt ? new Date(latestMap[b.id].createdAt).getTime() : 0;
                return bTime - aTime;
            });

            setMessages(msgMap);
            setLatestMessages(latestMap);
            setUsersList(sortedUsers);
            setCurrentUser(users.length > 0 ? sortedUsers[0] : null);
        }

        fetchAllMessage()
        socket.emit("join_message", user.id);
    }, [user])

    useEffect(() => {
        socket.on("receive_message", (data) => {
            handleNewMessage(data);
        });

        return () => socket.off("receive_message");
    }, [currentUser, user]);

    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen flex flex-col gap-2">
                <div className="w-full h-fit shadow-lg py-2 px-4 flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4">
                        <button className="bg-citrus-peach-light px-2 rounded-lg cursor-pointer lg:hidden" onClick={() => {
                            setShowSideBar(!showSidebar)
                        }}>
                            <FontAwesomeIcon className={`text-citrus-rose transition-all duration-200 ${showSidebar ? "rotate-90 scale-110" : "rotate-0 scale-100"}`} icon={showSidebar ? faXmark : faBars} />
                        </button>
                        <img className="w-17 cursor-pointer" src={logo} onClick={() => navigate("/home")}/>
                    </div>
                    <UserNav user={user} />
                </div>
                <div className="w-full h-full flex flex-row gap-2 relative overflow-hidden">
                    <ChatSideBar users={usersList} latestMessages={latestMessages} showSidebar={showSidebar} onSelectUser={(u) => {
                        if(u !== null) {
                            setCurrentUser(u)
                            setMessage("")
                        }
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