import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import profile from "../../assets/blank_profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoaderData } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { lazy } from "react";

const ChatBubble = lazy(() => import("./ChatBubble"));

export default function ChatRoom({ user: currentUser, message, messages, onMessageChange, onMessageSent }) {
    const { user } = useLoaderData();
    const bottomRef = useRef(null);
    const containerRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsAtBottom(entry.isIntersecting);
            },
            { threshold: 1.0 }
        );

        if (bottomRef.current) observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isAtBottom && bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isAtBottom]);

    return (
        <div className="bg-citrus-peach-light w-full h-full rounded-lg flex flex-col">
            { currentUser ? (
                <>
                    <div className="w-full h-14 shadow-xl p-2">
                        <div className="h-full flex items-center gap-2">
                            <img className="min-w-7 w-7 rounded-full" src={profile}/>
                            <div>
                                <h1 className="text-lg text-citrus-rose font-bold">{currentUser.name}</h1>
                                <p className="text-sm text-citrus-pink font-bold">@{currentUser.username}</p>
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="w-full h-full p-3 overflow-y-scroll flex flex-col items-center gap-2 no-scrollbar">
                        {(messages[currentUser.id] ?? []).map((msg) => (
                            <ChatBubble key={msg.id} user={user.id === msg.from ? user : currentUser} data={msg} isOwner={msg.from === user.id} />
                        ))}
                        <div ref={bottomRef}/>
                    </div>
                    <div className="w-full min-h-13 max-h-30 rounded-b-lg inset-shadow-sm px-3 py-2 flex flex-row items-center gap-2">
                        <textarea className="bg-slate-100 w-full min-h-10 h-10 max-h-full px-2 py-1.5 rounded-xl outline-none text-lg text-citrus-orange font-semibold"
                            placeholder={`Say something for @${user.username}`} onChange={(e) => onMessageChange(e.target.value)} value={message}></textarea>
                        <button className="px-2 text-lg text-citrus-rose cursor-pointer" onClick={() => onMessageSent()}>
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </button>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    )
}