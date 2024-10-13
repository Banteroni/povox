import React, { useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPeopleFill, BsPlayFill, BsSkipEndFill, BsSkipStartFill, BsVolumeDownFill } from "react-icons/bs";
import { FaGear, FaHouse, FaRecordVinyl } from "react-icons/fa6";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import BackendManager from "./utils/BackendManager";
import { useAppSelector } from "./global/hooks";
import Fetcher from "./utils/Fetcher";

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
    const location = useLocation()

    // States
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const musicBarState = useAppSelector(x => x.musicBar);
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [progression, setProgression] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Refs
    const musicBar = useRef<HTMLDivElement | null>(null);
    const contentContainer = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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
            const fetcher = await bem.CreateFetcher();
            setFetcher(fetcher);

        }
        initialize();
    }, [navigate])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume])

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            if (isPlaying) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }
    }, [isPlaying])

    useEffect(() => {
        if (fetcher) {
            loadTrack(musicBarState.trackId as string);
        }
    }, [musicBarState.trackId, fetcher])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", () => {
                if (audioRef.current) {
                    const duration = audioRef.current.duration;
                    const currentTime = audioRef.current.currentTime;
                    const progression = (currentTime / duration) * 100;
                    setCurrentTime(currentTime);
                    setProgression(progression);
                }
            });
            audioRef.current.addEventListener("play", () => {
                setIsPlaying(true);
            })
            audioRef.current.addEventListener("pause", () => {
                setIsPlaying(false);
            })
        }
    }, [audioRef])

    const loadTrack = async (trackId: string) => {
        if (!fetcher) {
            return;
        }
        const audioElement = audioRef.current;
        if (!audioElement) {
            return;
        }
        audioElement.pause(); // Stop the audio
        audioElement.src = ""; // Clear the source

        const reader = await fetcher.GetStream(trackId);
        const mediaSource = new MediaSource();

        audioElement.src = URL.createObjectURL(mediaSource);
        audioElement.controls = true;
        audioElement.play();


        mediaSource.addEventListener('sourceopen', async () => {
            const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

            const readNextChunk = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    // Signal that we're done appending
                    mediaSource.endOfStream();
                    return;
                }

                // Wait until the buffer is ready to accept more data
                sourceBuffer.addEventListener('updateend', () => {
                    readNextChunk(); // Read the next chunk
                }, { once: true });

                // Append the chunk to the source buffer
                sourceBuffer.appendBuffer(value);
            };

            readNextChunk(); // Start reading the first chunk
        });
    };


    // Get MM:SS from current time seconds and duration
    var currentTimeStringSeconds = Math.floor(currentTime % 60).toString();
    if (currentTimeStringSeconds.length === 1) {
        currentTimeStringSeconds = `0${currentTimeStringSeconds}`;
    }
    const currentTimeStringMinutes = Math.floor(currentTime / 60);
    const currentDurationString = `${currentTimeStringMinutes}:${currentTimeStringSeconds}`;

    const duration = musicBarState.duration;
    var durationStringSeconds = Math.floor(duration % 60).toString();
    if (durationStringSeconds.length === 1) {
        durationStringSeconds = `0${durationStringSeconds}`;
    }
    const durationStringMinutes = Math.floor(duration / 60);
    const durationString = `${durationStringMinutes}:${durationStringSeconds}`;

    return (
        <main className="h-screen min-w-full prose flex flex-col overflow-hidden justify-between">
            <div className="flex overflow-hidden flex-1">
                <nav className=" border-r  border-solid border-secondary bg-base-300 flex flex-col p-8 pl-5 md:min-w-72">
                    <h3 className="hidden md:block navbar-section px-3">Welcome</h3>
                    {routes.map((route) => (
                        <Anchor key={route.href} href={route.href} text={route.text} icon={route.icon} />
                    ))}
                    <h3 className="hidden md:block navbar-section px-3">Recommended</h3>

                </nav>

                <div className={`w-full p-2 xxl:p-0  duration-300`} ref={contentContainer}>

                    <div className="container mx-auto h-full pt-12">
                        <Outlet />
                    </div>
                </div>
            </div>
            <div className="w-full bottom-0 bg-base-300 grid grid-cols-3 p-3 border-t border-solid border-secondary" ref={musicBar}>
                <audio ref={audioRef} controls className="hidden" />

                <div className="flex">
                    {
                        musicBarState.trackId && (<>
                            {musicBarState.coverArt && <img className="h-14 w-14 rounded m-0" src={musicBarState.coverArt} />}
                            <div className="flex flex-col justify-center pl-3">
                                <label className="text-white">{musicBarState.trackName}</label>
                                <span className="text-sm">{musicBarState.artist}</span>
                            </div></>)
                    }
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="flex gap-x-2 text-3xl">
                        <button><BsSkipStartFill /></button>
                        {isPlaying ? <button className="text-white" onClick={invertPlaying}><BsPauseFill /></button> : <button onClick={invertPlaying} className="text-primary"><BsPlayFill /></button>}

                        <button><BsSkipEndFill /></button>
                    </div>
                    <div className="flex w-full items-center gap-x-3 text-sm">
                        {currentDurationString}
                        <div className="bg-neutral h-1 w-full rounded-full" >
                            <div className="bg-white h-1 rounded-full" style={{ width: progression + "%" }} />
                        </div>
                        {durationString}
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
        <Link className="no-underline font-normal flex justify-start items-center gap-x-3 text-neutral-content hover:bg-white/10 p-3 rounded-xl duration-75" to={props.href}><span className="text-primary text-2xl lg:text-base">{props.icon && props.icon}</span> <span className="hidden md:block duration-300">{props.text}</span></Link>)
}
