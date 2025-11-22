import { lazy } from "react"
import image from "../assets/image_placeholder.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";

const Navigation = lazy(() => import("../components/Navigation"));

export default function HomePage() {
    return (
        <div className="bg-gray-300 w-screen h-screen py-10 flex flex-col items-center gap-3 overflow-y-scroll no-scrollbar">
            <Navigation/>
            <div className="bg-gray-500 w-[95%] lg:w-[80%] aspect-2/1 sm:aspect-4/1 rounded-lg mt-20 md:mt-10"></div>
            <div className="w-[96%] lg:w-[86%] flex flex-row flex-wrap gap-5 justify-center items-center">
                <Cards/>
                <Cards/>
                <Cards/>
                <Cards/>
                <Cards/>
                <Cards/>
            </div>
        </div>
    )
}

function Cards() {
    return (
        <div className="bg-gray-100 w-42 h-fit xs:w-45 h-50 flex flex-col cursor-pointer transition-all duration-300 shadow-gray-700 hover:shadow-md">
            <img className="w-full aspect-3/2" src={image}/>
            <div className="px-2 py-3 flex flex-col">
                <h1 className="text-black text-sm xs:text-base font-bold line-clamp-2">Example title of a service for testing purposes only</h1>
                <h1 className="text-citrus-rose text-xl xs:text-3xl font-bold">₱2000</h1>
                <p className="text-rose-700 text-2xs font-medium line-clamp-1">
                    <FontAwesomeIcon size="md" icon={faLocationDot} /> Nangka, Marikina City, National Capital Region
                </p>
                <p className="text-xs text-gray-500 font-semibold">
                    <FontAwesomeIcon className="text-yellow-500" size="md" icon={faStar} /> 4.5 | 500 Bookings
                </p>
            </div>
        </div>
    )
}