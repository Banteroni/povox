import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Fetcher from "../utils/Fetcher";
import BackendManager from "../utils/BackendManager";
import Track from "../models/Track";
import { useAppDispatch, useAppSelector } from "../global/hooks";
import Front from "../utils/Front";
import { setBackgroundGradient } from "../global/features/styleSlice";
import TrackComponent from "../components/TrackComponent";
import { setMusicBarTrack } from "../global/features/musicBarSlice";





export default function Album() {
    let params = useParams();

    // State
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);

    // Refs
    const albumCoverRef = useRef<HTMLImageElement | null>(null);

    // State management
    const album = useAppSelector(x => x.album);
    const dispatch = useAppDispatch();

    // Functions
    const playTrack = (track: Track) => {
        dispatch(setMusicBarTrack(track));
    }

    // UseEffects
    useEffect(() => {
        async function init() {
            const backendManager = new BackendManager();
            await backendManager.Initialize();
            const fetcher = await backendManager.CreateFetcher();
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

    useEffect(() => {
        if (album.image !== null) {
            var image = document.createElement('img');
            image.src = album.image;
            var color = Front.getAverageRGB(image);
            var hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
            dispatch(setBackgroundGradient(hex));
        }
    }, [album])



    return (
        <main className="flex h-full items-center">
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
                            <TrackComponent isPlaying={false} key={track.id} track={track} order={i} onClick={() => playTrack(track)} />
                        ))}
                    </div>
                </div>
            </div>
        </main>

    )
}