import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Fetcher from "../services/Fetcher";
import BackendService from "../services/BackendService";
import Track from "../models/Track";
import { useAppDispatch, useAppSelector } from "../global/hooks";
import TrackComponent from "../components/TrackComponent";
import { addPastTracks, setMusicBarTrack, setQueueTracks } from "../global/features/musicBarSlice";

export default function Album() {
    let params = useParams();
    const musicBarSlice = useAppSelector(x => x.musicBar);

    // State
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);

    // Refs
    const albumCoverRef = useRef<HTMLImageElement | null>(null);

    // State management
    const album = useAppSelector(x => x.album);
    const musicBar = useAppSelector(x => x.musicBar);
    const dispatch = useAppDispatch();

    // Functions
    const playTrack = (track: Track) => {
        dispatch(setMusicBarTrack(track));
        const trackIds = tracks.map(x => x.id);
        const index = trackIds.indexOf(track.id);
        const tracksToQueue = tracks.slice(index + 1).map(x => x.id);
        dispatch(setQueueTracks(tracksToQueue));
        if (musicBarSlice.isPlaying) {
            dispatch(addPastTracks([track.id]));
        }
    }

    // UseEffects
    useEffect(() => {
        async function init() {
            const backendService = new BackendService();
            await backendService.Initialize();
            const fetcher = await backendService.CreateFetcher();
            setFetcher(fetcher);
        }
        init();
    }, [])

    useEffect(() => {
        if (fetcher !== null && params.id) {
            async function fetchData() {
                if (fetcher) {
                    const tracks = await fetcher.GetTracksByAlbum(params.id as string);
                    for (let i = 0; i < tracks.length; i++) {
                        tracks[i].coverArt = album.image as string;
                    }
                    setTracks(tracks);
                }
            }
            fetchData();
        }
    }, [fetcher, params.id])



    return (
        <main className="flex h-full items-center">

            <div className="absolute -z-10 left-0 right-0 bottom-0 ">
                <img src={album.image ? album.image : ""} alt="Album cover" className={`w-full object-cover blur-3xl duration-1000 ${album.image ? "opacity-20" : "opacity-0"}`} />
            </div>
            <div className="grid grid-cols-2 gap-x-4" style={{ height: albumCoverRef.current?.height }}>
                <div className="h-fit">
                    {album.image && (
                        <img src={album.image} ref={albumCoverRef} alt="Album cover" className="rounded-2xl w-full m-0" />
                    )}
                </div>
                <div style={{ height: "inherit" }} className="flex flex-col justify-start">
                    <div>
                        <h1 className="m-0">{album.title}</h1>
                        <h2 className="mt-3 font-normal">{album.artist}</h2>
                    </div>
                    <div className="overflow-y-scroll">
                        {tracks.map((track, i) => (
                            <TrackComponent isPlaying={musicBar.trackId == track.id} key={track.id} track={track} order={i} onClick={() => playTrack(track)} />
                        ))}
                    </div>
                </div>
            </div>
        </main>

    )
}