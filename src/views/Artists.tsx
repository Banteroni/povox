import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Fetcher from "../utils/Fetcher";
import BackendManager from "../utils/BackendManager";
import { GetEntityType } from "../types/enums";
import Artist from "../models/Artist";

export default function Artists() {
    // States
    const [artists, setArtists] = useState<Artist[]>([]);
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
            setFetcher(fetcher);
        })()
    }, [])

    useEffect(() => {
        if (fetcher) {
            queryArtists();
        }
    }, [fetcher])

    useEffect(() => {
        if (search.isSearching) {
            queryArtists();
        }
    }, [search.isSearching])

    // functions
    const searchKeyUpevent = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.isFocused === true) {
            setSearch(x => ({ ...x, isSearching: true }))
        }
    }

    const queryArtists = async () => {
        if (fetcher) {
            var fetchedArtists: Artist[] = []
            var currentArtists = artists;

            if (search.value === "") {
                let offset = 0;
                if (currentArtists.length > 0 && moreRecords == true) {
                    offset = currentArtists.length;
                }
                fetchedArtists = await fetcher.getArtists({ size: 15, offset: offset, type: GetEntityType.FREQUENT })
                if (currentArtists.length < 15) {
                    setMoreRecords(false)
                }
                else {
                    setMoreRecords(true)
                }
            }
            else {
                setMoreRecords(false)
                currentArtists = []
                const query = await fetcher.Query(search.value)
                currentArtists = query.artist;
                setSearch(x => ({ ...x, isSearching: false }))
            }

            for (let i = 0; i < currentArtists.length; i++) {
                const coverArt = await fetcher.GetCoverArt(currentArtists[i].id);
                currentArtists[i].coverArt = URL.createObjectURL(new Blob([coverArt]))
            }
            setArtists([...currentArtists, ...fetchedArtists])
            setSearch(x => ({ ...x, isSearching: false }))
        }
    }

    const onScroll = async (e: React.UIEvent<HTMLDivElement>) => {

        // Check if the user has scrolled to the bottom of the page
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight) {
            if (moreRecords) {
                await queryArtists()
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
                {artists.map(artist => (
                    <div>{artist.name}</div>
                ))}
            </div>
        </>
    )
}
