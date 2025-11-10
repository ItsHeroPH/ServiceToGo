import logo from "../assets/logo.png";

export default function LoadingScreen() {
    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen flex flex-col justify-center items-center">
                <img className="w-80" src={logo}/>
            </div>
        </>
    )
}