import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
    return (
        <>
            <div className="bg-citrus-rose w-full h-full p-2 flex justify-between items-center">
                <div className="bg-citrus-peach-light w-[400px] h-fit rounded-lg p-2 flex items-center">
                    <input className="w-full h-fit outline-none align-middle text-citrus-rose font-medium" placeholder="Search Services"/>
                    <div className="bg-citrus-rose h-fit p-1 rounded-md cursor-pointer">
                        <FontAwesomeIcon className="text-citrus-peach-light" icon={faMagnifyingGlass}/>
                    </div>
                </div>
            </div>
        </>
    )
}