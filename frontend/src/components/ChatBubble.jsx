import profile from "../assets/blank_profile.png"

export default function ChatBubble({ user, data, isOwner }) {
    const date = new Date(data.createdAt);
    const now = new Date();

    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    let dateString = "just now";
    if (diffYear > 0) {
        dateString = `${diffYear} ${diffYear > 1 ? "years" : "year"} ago`;
    } else if (diffMonth > 0) {
        dateString = `${diffMonth} ${diffMonth > 1 ? "months" : "month"} ago`;
    } else if (diffDay > 0) {
        dateString = `${diffDay} ${diffDay > 1 ? "days" : "day"} ago`;
    } else if (diffHour > 0) {
        dateString = `${diffHour} ${diffHour > 1 ? "hours" : "hour"} ago`;
    } else if (diffMin > 0) {
        dateString = `${diffMin} ${diffMin > 1 ? "minutes" : "minute"} ago`;
    } else if (diffSec > 0) {
        dateString = `${diffSec} ${diffSec > 1 ? "seconds" : "second"} ago`;
    }

    return (
        <>
            { isOwner ? (
                <div className="w-full h-fit flex items-start gap-2">
                    <div className="w-full h-fit flex flex-col items-end gap-1">
                        <p className="text-sm text-citrus-orange font-medium">You<span className="hidden md:inline"> • {dateString}</span></p>
                        <div className="bg-slate-200 max-w-[66%] h-fit p-2 rounded-lg shadow-lg breaks-words">
                            <p className="text-md text-citrus-orange font-medium break-all text-start">{data.message}</p>
                        </div>
                    </div>
                    <img className="min-w-10 w-10 rounded-full" src={profile}/>
                </div>
            ) : (
                <div className="w-full h-fit flex items-start gap-2">
                    <img className="min-w-10 w-10 rounded-full" src={profile}/>
                    <div className="w-full h-fit flex flex-col items-start gap-1">
                        <p className="text-sm text-citrus-orange font-medium">{user.username}<span className="hidden md:inline"> • {dateString}</span></p>
                        <div className="bg-slate-200 max-w-[66%] h-fit p-2 rounded-lg shadow-lg breaks-words">
                            <p className="text-md text-citrus-orange font-medium break-all text-start">{data.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}