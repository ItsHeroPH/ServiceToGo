import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import profile from "../assets/blank_profile.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ChatBubble from "./ChatBubble"
import { useLoaderData } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

export default function ChatRoom({ user, message, messages, onMessageChange, onMessageSent }) {
    const { user: author } = useLoaderData();
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
            <div className="w-full h-14 shadow-xl p-2">
                <div className="h-full flex items-center gap-2">
                    <img className="min-w-7 w-7 rounded-full" src={profile}/>
                    <h1 className="text-lg text-citrus-rose font-bold">{user.username}</h1>
                </div>
            </div>
            <div ref={containerRef} className="w-full h-full p-3 overflow-y-scroll flex flex-col items-center gap-2 no-scrollbar">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} user={author.id === msg.from ? author : user} data={msg} isOwner={msg.from === author.id} />
                ))}
                <div ref={bottomRef}/>
            </div>
            <div className="w-full min-h-13 max-h-30 rounded-b-lg inset-shadow-sm px-3 py-2 flex flex-row items-center gap-2">
                <textarea className="bg-slate-100 w-full min-h-10 h-10 max-h-full px-2 py-1.5 rounded-xl outline-none text-lg text-citrus-orange font-semibold"
                    placeholder={`Say something for ${user.username}`} onChange={(e) => onMessageChange(e.target.value)} value={message}></textarea>
                <button className="px-2 text-lg text-citrus-rose cursor-pointer" onClick={() => onMessageSent()}>
                    <FontAwesomeIcon icon={faPaperPlane}/>
                </button>
            </div>
        </div>
    )
}