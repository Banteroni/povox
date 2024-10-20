import React, { useEffect, useRef, useState } from "react";
import { BsPauseFill, BsPeopleFill, BsPlayFill, BsSkipEndFill, BsSkipStartFill, BsVolumeDownFill } from "react-icons/bs";
import { FaGear, FaHouse, FaRecordVinyl } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "./global/hooks";
import Fetcher from "./services/Fetcher";
import { addPastTracks, removePastTracks, removeQueueTracks, setMusicBarTrack, setPlaying, setQueueTracks } from "./global/features/musicBarSlice";
import { useDispatch } from "react-redux";
import { toMMSS } from "./services/MiscUtils";
import BackendService from "./services/BackendService";
import Artist from "./models/Artist";
import { RouteToArtist } from "./services/RoutingUtils";

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
    const dispatch = useDispatch();

    // States
    const [volume, setVolume] = useState(50);
    const musicBarState = useAppSelector(x => x.musicBar);
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [progression, setProgression] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [progressBarState, setProgressBarState] = useState({
        isChanging: false,
        canChange: false
    });

    // Refs
    const musicBar = useRef<HTMLDivElement | null>(null);
    const contentContainer = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progessionBar = useRef<HTMLDivElement | null>(null);

    // Effects
    useEffect(() => {
        async function initialize() {
            const bem = new BackendService();
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
            if (musicBarState.isPlaying) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }
    }, [musicBarState.isPlaying])

    useEffect(() => {
        if (fetcher && musicBarState.trackId) {
            loadTrack(musicBarState.trackId as string);
        }
    }, [musicBarState.trackId, fetcher])

    // Functions
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

        const reader = fetcher.GetStreamUrl(trackId);
        audioElement.src = reader

        audioElement.play();
    };

    const onTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
        const duration = musicBarState.duration;
        const currentTime = e.currentTarget.currentTime;
        const percentageProgress = (currentTime / duration) * 100;

        // Get width of progressionBar
        if (progessionBar.current) {
            const width = progessionBar.current.offsetWidth;
            const finalWidth = Math.round((width / 100) * percentageProgress);
            setProgression(finalWidth);
        }
        setCurrentTime(currentTime);
    }


    const handleLastInQueue = async () => {
        if (!fetcher) {
            return;
        }
        const trackId = musicBarState.past[musicBarState.past.length - 1];
        if (trackId) {
            var track = await fetcher.GetTrack(trackId);
            if (track.albumId == musicBarState.albumId && musicBarState.coverArt !== null) {
                track.coverArt = musicBarState.coverArt;
            }
            else {
                track.coverArt = await track.GetCoverArtUrl(fetcher);
            }
            dispatch(setQueueTracks([musicBarState.trackId as string, ...musicBarState.queue]));
            dispatch(setMusicBarTrack(track));
            dispatch(removePastTracks([trackId]));
        }
    }

    const handleNextInQueue = async () => {
        if (!fetcher) {
            return;
        }
        const trackId = musicBarState.queue[0];
        if (trackId) {

            var track = await fetcher.GetTrack(trackId);
            if (track.albumId == musicBarState.albumId && musicBarState.coverArt !== null) {
                track.coverArt = musicBarState.coverArt;
            }
            dispatch(addPastTracks([musicBarState.trackId as string]));
            dispatch(setMusicBarTrack(track));
            dispatch(removeQueueTracks([trackId]));
        }
    }

    const invertPlaying = () => {
        dispatch(setPlaying(!musicBarState.isPlaying));
    }

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseInt(e.target.value));
    }

    const handleProgressBarMovement = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressBarState.isChanging) {
            if (musicBarState.isPlaying) {
                invertPlaying();
            }
            const width = e.clientX;
            // get the offset from the left of the screen
            const offset = progessionBar.current?.getBoundingClientRect()
            if (offset && progessionBar.current) {
                const zero = offset.left;
                setProgression(width - zero);
                const duration = musicBarState.duration;
                const percentage = (width - zero) / progessionBar.current.offsetWidth as number;
                const newTime = duration * percentage;
                if (audioRef.current) {
                    audioRef.current.currentTime = newTime;
                }
            }
        }
    }

    // Get MM:SS from current time seconds and duration
    const currentDurationString = toMMSS(currentTime);
    const durationString = toMMSS(musicBarState.duration);

    const artist = new Artist(musicBarState.artistId as string, musicBarState.artist as string, musicBarState.coverArt as string, musicBarState.coverArt as string, 0, [])

    return (
        <main className="h-screen min-w-full prose flex flex-col overflow-hidden justify-between" onMouseUp={() => setProgressBarState(() => ({ canChange: false, isChanging: false }))} onClick={handleProgressBarMovement} onMouseMove={handleProgressBarMovement}>
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
                <audio ref={audioRef} controls className="hidden" onTimeUpdate={onTimeUpdate} onPlay={() => dispatch(setPlaying(true))} onPause={() => dispatch(setPlaying(false))} onEnded={handleNextInQueue} />

                <div className="flex">
                    {
                        musicBarState.trackId && (<>
                            {musicBarState.coverArt && <img className="h-14 w-14 rounded m-0" src={musicBarState.coverArt} />}
                            <div className="flex flex-col justify-center pl-3">
                                <Link to={`albums/${musicBarState.albumId}`} className="text-white no-underline font-normal hover:underline">{musicBarState.trackName}</Link>
                                {/* <Link className="text-sm font-normal no-underline hover:underline" to={`artists/${musicBarState.artistId}`}>{musicBarState.artist}</Link> */}
                                <span className="text-sm font-normal no-underline hover:underline" onClick={() => RouteToArtist(artist, navigate, dispatch)}>{musicBarState.artist}</span>
                            </div></>)
                    }
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="flex gap-x-2 text-3xl">
                        <button onClick={handleLastInQueue}><BsSkipStartFill /></button>
                        {musicBarState.isPlaying ? <button className="text-white" onClick={invertPlaying}><BsPauseFill /></button> : <button onClick={invertPlaying} className="text-primary"><BsPlayFill /></button>}

                        <button onClick={handleNextInQueue}><BsSkipEndFill /></button>
                    </div>
                    <div className="flex w-full items-center gap-x-3 text-sm">
                        {currentDurationString}
                        <div className="bg-neutral h-1 w-full rounded-full" ref={progessionBar} onMouseEnter={() => setProgressBarState(x => ({ ...x, canChange: true }))} onMouseDown={() => setProgressBarState(x => ({ ...x, isChanging: true }))} onMouseLeave={() => setProgressBarState(x => ({ ...x, canChange: false }))}>
                            <div className={`${progressBarState.canChange || progressBarState.isChanging ? "bg-primary" : "bg-white"} h-1 rounded-full relative flex items-center`} style={{ width: `${progression}px` }}>
                                {(progressBarState.canChange || progressBarState.isChanging) && <div className="w-4 h-4 bg-white absolute -right-2 rounded-full"></div>}
                            </div>

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
        <Link className="no-underline font-normal flex justify-start items-center gap-x-3 text-neutral-content hover:bg-white/10 p-3 rounded-xl duration-75" to={props.href}><span className="text-primary">{props.icon && props.icon}</span> <span className="hidden md:block duration-300">{props.text}</span></Link>)
}
