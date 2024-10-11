import { useEffect, useState } from "react";
import Fetcher from "../utils/Fetcher";
import BackendManager from "../utils/BackendManager";
import Album from "../models/Album";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../global/hooks";
import { setAlbum } from "../global/features/albumSlice";

export default function Index() {
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loadAlbums = async () => {
        if (!fetcher) {
            return;
        }
        const albums = await fetcher.getAlbums();
        for (const album of albums) {
            const coverArt = await fetcher.GetCoverArt(album.id);
            const url = URL.createObjectURL(new Blob([coverArt]));
            album.coverArt = url;
        }
        setAlbums(albums);
    }

    useEffect(() => {
        if (fetcher) {
            loadAlbums();
        }
    }, [fetcher])

    useEffect(() => {
        async function init() {
            const backendManager = new BackendManager();
            await backendManager.Initialize();
            const fetcher = await backendManager.CreateFetcher();
            setFetcher(fetcher);
        }
        init();
    }, [])

    const navigateToAlbum = (id: string) => {
        var album = albums.find(x => x.id === id);
        if (!album) {
            return;
        }
        dispatch(setAlbum({
            id: album.id,
            title: album.album,
            tracks: [],
            image: album.coverArt,
        }))
        navigate("/albums/" + id);

    }
    return (
        <div>
            <h1>Good evening, Luca 🌚</h1>
            <p>Here are some albums you may like:</p>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
                {albums.map(x => (
                    <div key={x.id}>
                        <img src={x.coverArt} alt={x.album} className="mb-2 hover:scale-105 duration-300 cursor-pointer" onClick={() => navigateToAlbum(x.id)} />
                        <h2 className="m-0 text-lg">{x.album}</h2>
                        <span>{x.artist}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}