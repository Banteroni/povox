import { useParams } from "react-router-dom";
import { useAppSelector } from "../global/hooks";
import { useEffect, useState } from "react";
import BackendService from "../services/BackendService";
import Fetcher from "../services/Fetcher";
import Album from "../models/Album";
import AlbumComponent from "../components/AlbumComponent";

export default function Artist() {
    let params = useParams();
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);

    const artist = useAppSelector(x => x.artist)

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
        async function fetchAlbums() {
            if (fetcher) {
                const artistInfo = await fetcher.GetArtist(params.id as string)
                if (artistInfo.album) {
                    var query = await fetcher.Query(artistInfo.name)
                    for (let i = 0; i < query.album.length; i++) {
                        const coverArt = await fetcher.GetCoverArt(query.album[i].coverArt);
                        query.album[i].coverArt = URL.createObjectURL(new Blob([coverArt]))
                    }
                    setAlbums(query.album)
                }
            }
        }
        if (fetcher) {
            fetchAlbums();
        }
    }, [fetcher])

    return (
        <main>
            <div className="flex h-96 p-5 bg-gradient-to-l from-white/10 to-white/0 rounded-xl gap-x-5">
                <img src={artist.image as string} className="m-0 rounded-xl" />
                <div className="flex flex-col">
                    <h3 className="navbar-section m-0 mb-4">ARTIST</h3>
                    <h1 className="mb-2">{artist.name}</h1>
                </div>
            </div>
            <h1 className="my-8">Discography</h1>
            <div className="grid grid-cols-5 gap-4">
                {albums.map((album, index) => {
                    album.artist = "";
                    return (
                        <AlbumComponent key={index} album={album} />
                    )
                })}
            </div>

        </main>
    )
}