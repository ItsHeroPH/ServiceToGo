import profile from "../../assets/blank_profile.png";
import { formatDate } from "../../util/ChatDateFormatter";

export default function ChatSideBar({ users, latestMessages, showSidebar, onSelectUser }) {
    return (
        <>
            <div className={`bg-black w-full h-full absolute lg:hidden z-20 top-0 left-0 right-0 bottom-0 transition-all duration-300 ${showSidebar ? "opacity-25 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => onSelectUser(null)}></div>
            <div className={`bg-citrus-peach-light min-w-80 max-w-80 h-full shadow-xl rounded-lg p-5 flex flex-col gap-4 absolute lg:static top-0 left-0 z-40 transform transition-transform duration-300 overflow-y-scroll no-scrollbar
                ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <h1 className="text-2xl text-citrus-rose font-bold">Chats</h1>
                { users.map((user) => (
                    <User key={user.id} user={user} onSelectUser={onSelectUser} latestMessage={latestMessages[user.id]} />
                ))}
            </div>
        </>
    )
}

function User({ user, onSelectUser, latestMessage }) {
    return (
        <div className="w-full h-15 flex flex-row items-center gap-2 cursor-pointer" onClick={() => onSelectUser(user)}>
            <img className="min-w-10 w-10 max-w-10 rounded-full" src={user.avatar ? user.avatar : profile}/>
            <div className="w-full max-h-full flex flex-col overflow-hidden">
                <h1 className="select-none text-lg text-citrus-orange font-bold truncate">{user.name}</h1>
                <div className="flex gap-1">
                    <p className="text-xs text-slate-500 whitespace-normal overflow-hidden break-all text-ellipsis line-clamp-1">{latestMessage ? `${latestMessage.from === user.id ? user.name : "You"}: ${latestMessage.message}` : "No messages yet"}</p>
                    {
                        latestMessage && (
                            <p className="text-xs text-slate-500 ">• {
                                formatDate(new Date(latestMessage.createdAt), true)
                            }</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}