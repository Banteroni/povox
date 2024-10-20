import { useEffect, useState } from "react";
import Fetcher from "../services/Fetcher.ts";
import BackendService from "../services/BackendService.ts";
import Album from "../models/Album";
import { GetEntityType } from "../types/enums.ts";
import AlbumComponent from "../components/AlbumComponent.tsx";
import { AlbumInfo } from "../types/Fetcher";
import { RouteToAlbum } from "../services/RoutingUtils.ts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function Index() {
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [latestAlbum, setLatestAlbum] = useState<{
        album: Album | null,
        albumInfo: AlbumInfo | null,

    }>({
        album: null,
        albumInfo: null
    });

    const loadAlbums = async () => {
        if (!fetcher) {
            return;
        }
        const albums = await fetcher.getAlbums({
            type: GetEntityType.NEWEST,
            size: 6
        });
        const latestAlbum = await fetcher.getAlbums({
            size: 1,
            type: GetEntityType.RANDOM
        })
        const coverArt = await fetcher.GetCoverArt(latestAlbum[0].id);
        const url = URL.createObjectURL(new Blob([coverArt]));
        latestAlbum[0].coverArt = url;
        const albumInfo = await fetcher.GetAlbumInfo(latestAlbum[0].id);
        setLatestAlbum({
            album: latestAlbum[0],
            albumInfo: albumInfo
        });

        for (const album of albums) {
            const coverArt = await fetcher.GetCoverArt(album.id);
            const url = URL.createObjectURL(new Blob([coverArt]));
            album.coverArt = url;
        }
        setAlbums(albums);
    }

    useEffect(() => {
        if (fetcher && albums.length === 0) {
            loadAlbums();
        }
    }, [fetcher])

    useEffect(() => {
        async function init() {
            const backendService = new BackendService();
            await backendService.Initialize();
            const fetcher = await backendService.CreateFetcher();
            setFetcher(fetcher);
        }
        init();
    }, [])

    return (
        <div>
            <h1>Good day, Luca!</h1>
            <div className="flex h-96 p-5 bg-gradient-to-l from-white/10 to-white/0 rounded-xl gap-x-5">
                <img src={latestAlbum?.album?.coverArt} className="m-0 rounded-xl" />
                <div className="flex flex-col">
                    <h3 className="navbar-section m-0 mb-4">DISCOVER</h3>
                    <h1 className="mb-2">{latestAlbum?.album?.album}</h1>
                    <span className="text-xl">{latestAlbum?.album?.artist}</span>
                    <div dangerouslySetInnerHTML={{ __html: latestAlbum.albumInfo?.notes as string }} className="text-sm mt-8" />
                    <div className="flex-1 flex items-end gap-x-3">
                        <button className="btn btn-primary">Play</button>
                        <a onClick={() => RouteToAlbum(latestAlbum.album as Album, navigator, dispatch)} className="btn">View album</a>
                    </div>
                </div>
            </div>
            <h2 className="mb-0">Some albums you may like</h2>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                {albums.map(x => (
                    <AlbumComponent key={x.id} album={x} />
                ))}
            </div>
        </div>
    )
}