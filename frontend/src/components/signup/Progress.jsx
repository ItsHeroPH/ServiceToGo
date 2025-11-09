import { faArrowRightLong, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Progress({ currentPage }) {
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="w-8 flex flex-col items-center">
                <div className="bg-citrus-rose w-8 h-8 rounded-full flex justify-center items-center" >
                    <label className="text-lg text-citrus-peach-light font-bold">1</label>
                </div>
                <label className="text-xs text-citrus-rose font-bold">Email</label>
            </div>
            <FontAwesomeIcon className={`self-start mt-2 ${currentPage >= 2 ? "text-citrus-rose" : "text-slate-100"}`} icon={faArrowRightLong} />
            <div className="w-8 flex flex-col items-center">
                <div className={`${currentPage >= 2 ? "bg-citrus-rose" : "bg-slate-200"} w-8 h-8 rounded-full flex justify-center items-center`} >
                    <label className={`text-lg ${currentPage >= 2 ? "text-citrus-peach-light" : "text-citrus-orange"} font-bold`}>2</label>
                </div>
                <label className={`text-xs ${currentPage >= 2 ? "text-citrus-rose" : "text-citrus-orange"} font-bold`}>Verify</label>
            </div>
            <FontAwesomeIcon className={`self-start mt-2 ${currentPage >= 3 ? "text-citrus-rose" : "text-slate-100"}`} icon={faArrowRightLong} />
            <div className="w-8 flex flex-col items-center">
                <div className={`${currentPage >= 3 ? "bg-citrus-rose" : "bg-slate-200"} w-8 h-8 rounded-full flex justify-center items-center`}>
                    <label className={`text-lg ${currentPage >= 3 ? "text-citrus-peach-light" : "text-citrus-orange"} font-bold`}>3</label>
                </div>
                <label className={`text-xs ${currentPage >= 3 ? "text-citrus-rose" : "text-citrus-orange"} font-bold`}>Password</label>
            </div>
            <FontAwesomeIcon className={`self-start mt-2 ${currentPage >= 4 ? "text-citrus-rose" : "text-slate-100"}`} icon={faArrowRightLong} />
            <div className="w-8 flex flex-col items-center">
                <div className={`${currentPage >= 4 ? "bg-citrus-rose" : "bg-slate-200"} w-8 h-8 rounded-full flex justify-center items-center`}>
                    <label className={`text-lg ${currentPage >= 4 ? "text-citrus-peach-light" : "text-citrus-orange"} font-bold`}>4</label>
                </div>
                <label className={`text-xs ${currentPage >= 4 ? "text-citrus-rose" : "text-citrus-orange"} font-bold`}>Info</label>
            </div>
            <FontAwesomeIcon className={`self-start mt-2 ${currentPage >= 5 ? "text-citrus-rose" : "text-slate-100"}`} icon={faArrowRightLong} />
            <div className="w-8 flex flex-col items-center">
                <div className={`${currentPage >= 5 ? "bg-citrus-rose" : "bg-slate-200"} w-8 h-8 rounded-full flex justify-center items-center`}>
                    <FontAwesomeIcon className={currentPage >= 5 ? "text-citrus-peach-light" : "text-citrus-orange"} icon={faCheck}/>
                </div>
                <label className={`text-xs ${currentPage >= 5 ? "text-citrus-rose" : "text-citrus-orange"} font-bold`}>Done</label>
            </div>
        </div>
    )
}