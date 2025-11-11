import profile from "../../assets/blank_profile.png";
import { formatDate } from "../../util/ChatDateFormatter";

export default function ChatBubble({ user, data, isOwner }) {
    return (
        <>
            { isOwner ? (
                <div className="w-full h-fit flex items-start gap-2">
                    <div className="w-full h-fit flex flex-col items-end gap-1">
                        <p className="text-sm text-citrus-orange font-medium">You<span className="hidden md:inline"> • {formatDate(new Date(data.createdAt), false)}</span></p>
                        <div className="bg-slate-200 max-w-[66%] h-fit p-2 rounded-lg shadow-lg breaks-words">
                            <p className="text-md text-citrus-orange font-medium break-all text-start">{data.message}</p>
                        </div>
                    </div>
                    <img className="min-w-10 w-10 rounded-full" src={user.avatar ? user.avatar : profile}/>
                </div>
            ) : (
                <div className="w-full h-fit flex items-start gap-2">
                    <img className="min-w-10 w-10 rounded-full" src={user.avatar ? user.avatar : profile}/>
                    <div className="w-full h-fit flex flex-col items-start gap-1">
                        <p className="text-sm text-citrus-orange font-medium">{user.username}<span className="hidden md:inline"> • {formatDate(new Date(data.createdAt), false)}</span></p>
                        <div className="bg-slate-200 max-w-[66%] h-fit p-2 rounded-lg shadow-lg breaks-words">
                            <p className="text-md text-citrus-orange font-medium break-all text-start">{data.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}