import React, { useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPeopleFill, BsPlayFill, BsSkipEndFill, BsSkipStartFill, BsVolumeDownFill } from "react-icons/bs";
import { FaGear, FaHouse, FaRecordVinyl } from "react-icons/fa6";
import { Outlet, useNavigate } from "react-router-dom";
import BackendManager from "./utils/BackendManager";
import { useAppSelector } from "./global/hooks";

const routes: AnchorProps[] = [
    {
        href: "/",
        text: "Home",
        icon: <FaHouse />
    },
    {
        href: "/albums",
        text: "Albums",
        icon: <FaRecordVinyl />
    },
    {
        href: "/artists",
        text: "Artists",
        icon: <BsPeopleFill />
    },
    {
        href: "/settings",
        text: "Settings",
        icon: <FaGear />
    },
]

type AnchorProps = {
    href: string;
    text: string;
    icon?: React.ReactNode;
}


export default function Layout() {
    const navigate = useNavigate();

    // States
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const globalState = useAppSelector(x => x.style);

    // Refs
    const musicBar = useRef<HTMLDivElement | null>(null);
    const contentContainer = useRef<HTMLDivElement | null>(null);

    // Functions
    const invertPlaying = () => {
        setIsPlaying(!isPlaying);
    }

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseInt(e.target.value));
    }


    // Effects
    useEffect(() => {
        async function initialize() {
            const bem = new BackendManager();
            await bem.Initialize();
            const userData = await bem.GetUserData();
            if (!userData) {
                navigate("/landing")
            }

        }
        initialize();
    }, [navigate])


    return (
        <main className="h-screen min-w-full prose flex flex-col overflow-hidden justify-between">
            <div className="flex h-full">
                <nav className=" bg-gradient-to-t from-black/40 to-base-300 flex flex-col gap-y-5 p-8 md:min-w-72">
                    <h3 className="hidden md:block">Welcome</h3>
                    {routes.map((route) => (
                        <Anchor key={route.href} href={route.href} text={route.text} icon={route.icon} />
                    ))}
                    <h3 className="hidden md:block">Recommended</h3>

                </nav>

                <div className={`w-full p-2 xxl:p-0  duration-300`} style={{
                    background: `linear-gradient(to top, ${globalState.backgroundGradient}, rgba(255, 87, 51, 0))`
                }} ref={contentContainer}>

                    <div className="container mx-auto h-full pt-12">
                        <Outlet />
                    </div>
                </div>
            </div>
            <div className="w-full bottom-0 bg-base-300 grid grid-cols-3 p-5 flex-1" ref={musicBar}>
                <div className="flex">
                    <div className="h-14 w-14 bg-white rounded" />
                    <div className="flex flex-col justify-center pl-3">
                        <label className="text-white">Track name</label>
                        <span className="text-sm">Artist name</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-y-3">
                    <div className="flex gap-x-2 text-3xl">
                        <button><BsSkipStartFill /></button>
                        {isPlaying ? <button className="text-white" onClick={invertPlaying}><BsPauseFill /></button> : <button onClick={invertPlaying} className="text-primary"><BsPlayFill /></button>}

                        <button><BsSkipEndFill /></button>
                    </div>
                    <div className="bg-neutral h-1 w-[100%] rounded-full" >
                        <div className="bg-white h-1 w-1/3 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-2 ">
                    <BsVolumeDownFill className={`text-2xl text-white`} />

                    <input type="range" min={0} max="100" value={volume} onChange={changeVolume} className="range range-xs w-32" />
                </div>
            </div>
        </main>
    )
}

function Anchor(props: AnchorProps) {
    return (
        <a className="no-underline font-normal flex justify-start items-center gap-x-3 text-neutral-content" href={props.href}><span className="text-primary text-2xl lg:text-base">{props.icon && props.icon}</span> <span className="hidden md:block duration-300">{props.text}</span></a>)
}
