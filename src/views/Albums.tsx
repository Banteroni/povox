import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Album from "../models/Album";
import Fetcher from "../utils/Fetcher";
import BackendManager from "../utils/BackendManager";
import { GetAlbumsType } from "../types/enums";
import AlbumComponent from "../components/AlbumComponent";

export default function Albums() {
    // States
    const [albums, setAlbums] = useState<Album[]>([]);
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [search, setSearch] = useState<{
        isFocused: boolean,
        isSearching: boolean,
        value: string
    }>({
        isFocused: false,
        isSearching: false,
        value: ""
    })

    // use effects
    useEffect(() => {
        (async () => {
            const backendManager = new BackendManager();
            await backendManager.Initialize();
            const fetcher = await backendManager.CreateFetcher();
            setFetcher(fetcher);
        })()
    }, [])

    useEffect(() => {
        if (search.isSearching) {
            queryAlbums();
        }
    }, [search.isSearching])

    // functions
    const searchKeyUpevent = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.isFocused === true) {
            setSearch(x => ({ ...x, isSearching: true }))
        }
    }

    const queryAlbums = async () => {
        if (fetcher) {
            var albums: Album[] = []
            if (search.value === "") {
                albums = await fetcher.getAlbums({ size: 15, type: GetAlbumsType.FREQUENT })

            }
            else {
                const query = await fetcher.Query(search.value)
                albums = query.album
                setSearch(x => ({ ...x, isSearching: false }))
            }

            for (let i = 0; i < albums.length; i++) {
                const coverArt = await fetcher.GetCoverArt(albums[i].id);
                albums[i].coverArt = URL.createObjectURL(new Blob([coverArt]))
            }
            setAlbums(albums)
            setSearch(x => ({ ...x, isSearching: false }))

        }
    }

    return (
        <>
            <div className="flex w-full">
                <div className="join">
                    <label className="input bg-base-300 input-bordered flex items-center gap-2 join-item">
                        <input type="text" className="grow" placeholder="Search albums" disabled={search.isSearching} onKeyUp={searchKeyUpevent} value={search.value} onFocus={() => setSearch(x => ({ ...x, isFocused: true }))} onBlur={() => setSearch(x => ({ ...x, isFocused: false }))} onChange={(t) => setSearch(x => ({ ...x, value: t.target.value }))} />
                        <BsSearch className="hover:text-primary cursor-pointer" onClick={() => setSearch(x => ({ ...x, isSearching: true }))} />
                    </label>
                </div>
                <select className="select select-bordered">
                    <option>Sort by</option>
                    <option>Artist</option>
                    <option>Year</option>
                </select>
            </div>
            <div className="grid grid-cols-5 gap-4 overflow-y-auto max-h-full pb-28">
                {albums.map(album => (
                    <AlbumComponent key={album.id} album={album} />
                ))}
            </div>
        </>
    )
}
