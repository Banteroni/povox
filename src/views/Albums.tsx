import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Album from "../models/Album";
import Fetcher from "../utils/Fetcher";
import BackendManager from "../utils/BackendManager";
import { GetEntityType } from "../types/enums";
import AlbumComponent from "../components/AlbumComponent";

export default function Albums() {
    // States
    const [albums, setAlbums] = useState<Album[]>([]);
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [moreRecords, setMoreRecords] = useState<boolean>(true);
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
            fetcher.isReady = true;
            setFetcher(fetcher);
        })()
    }, [])

    useEffect(() => {
        if (fetcher && fetcher.isReady) {
            queryAlbums();
        }
    }, [fetcher])

    useEffect(() => {
        if (search.isSearching && fetcher?.isReady) {
            queryAlbums();
        }
    }, [search.isSearching, fetcher])

    // functions
    const searchKeyUpevent = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.isFocused === true) {
            setSearch(x => ({ ...x, isSearching: true }))
        }
    }

    const queryAlbums = async () => {
        if (fetcher) {
            var fetchedAlbums: Album[] = []
            var currentAlbums = albums;

            if (search.value === "") {
                let offset = 0;
                if (currentAlbums.length > 0 && moreRecords == true) {
                    offset = currentAlbums.length;
                }
                fetchedAlbums = await fetcher.getAlbums({ size: 15, offset: offset, type: GetEntityType.FREQUENT })
                if (fetchedAlbums.length < 15) {
                    setMoreRecords(false)
                }
                else {
                    setMoreRecords(true)
                }
            }
            else {
                setMoreRecords(false)
                currentAlbums = []
                const query = await fetcher.Query(search.value)
                fetchedAlbums = query.album
                setSearch(x => ({ ...x, isSearching: false }))
            }

            for (let i = 0; i < fetchedAlbums.length; i++) {
                const coverArt = await fetchedAlbums[i].GetCovertArtUrl(fetcher);
                fetchedAlbums[i].coverArt = coverArt;
            }
            setAlbums([...currentAlbums, ...fetchedAlbums])
            setSearch(x => ({ ...x, isSearching: false }))
        }
    }

    const onScroll = async (e: React.UIEvent<HTMLDivElement>) => {

        // Check if the user has scrolled to the bottom of the page
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight) {
            if (moreRecords) {
                await queryAlbums()
            }
        }
    }

    return (
        <>
            <div className="flex w-full pb-3">
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
            <div className="grid grid-cols-5 gap-4 overflow-y-auto max-h-full pb-56" onScroll={onScroll}>
                {albums.map(album => (
                    <AlbumComponent key={album.id} album={album} />
                ))}
            </div>
        </>
    )
}
