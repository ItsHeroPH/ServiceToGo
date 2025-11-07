import { lazy } from "react";
import { useLoaderData } from "react-router-dom";

const Navigation = lazy(() => import("../components/Navigation"));

export default function Home() {
    const { user } = useLoaderData();

    return (
        <>
            <div className="bg-citrus-peach-light w-screen h-screen flex flex-col">
                <Navigation user={user} />
            </div>
        </>
    )
}