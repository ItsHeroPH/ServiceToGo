import logo from "../assets/logo.png"

export default function LoadingScreen() {
    return (
        <>
            <div className="bg-citrus-rose w-screen h-screen flex flex-col items-center">
                <img className="w-100 my-auto" src={logo}/>
            </div>
        </>
    )
}