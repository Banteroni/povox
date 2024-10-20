import { useEffect, useState } from "react";
import Fetcher from "../services/Fetcher";
import BackendService from "../services/BackendService";
import { GetEntityType } from "../types/enums";
import Artist from "../models/Artist";
import ArtistComponent from "../components/ArtistComponent";

export default function Artists() {
    // States
    const [artists, setArtists] = useState<Artist[]>([]);
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [moreRecords, setMoreRecords] = useState<boolean>(true);

    // use effects
    useEffect(() => {
        (async () => {
            const backendService = new BackendService();
            await backendService.Initialize();
            const fetcher = await backendService.CreateFetcher();
            setFetcher(fetcher);
        })()
    }, [])

    useEffect(() => {
        if (fetcher) {
            searchArtists();
        }
    }, [fetcher])

    const searchArtists = async () => {
        if (fetcher) {
            var fetchedArtists: Artist[] = []
            var currentArtists = artists;
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
            for (let i = 0; i < fetchedArtists.length; i++) {
                const coverArt = await fetcher.GetCoverArt(fetchedArtists[i].coverArt);
                fetchedArtists[i].coverArt = URL.createObjectURL(new Blob([coverArt]))
            }
            setArtists([...currentArtists, ...fetchedArtists])
        }
    }

    const onScroll = async (e: React.UIEvent<HTMLDivElement>) => {

        // Check if the user has scrolled to the bottom of the page
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight) {
            if (moreRecords) {
                await searchArtists()
            }
        }
    }

    return (
        <div className="grid grid-cols-5 gap-4 overflow-y-auto max-h-full pb-56" onScroll={onScroll}>
            {artists.map(artist => <ArtistComponent key={artist.id} artist={artist} />)}
        </div>
    )
}
