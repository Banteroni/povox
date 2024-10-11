import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Fetcher from "../utils/Fetcher";
import BackendManager from "../utils/BackendManager";
import Track from "../models/Track";
import { useAppDispatch, useAppSelector } from "../global/hooks";
import Front from "../utils/Front";

export default function Album() {
    let params = useParams();
    const [fetcher, setFetcher] = useState<Fetcher | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [gradientColor, setGradientColor] = useState<string>("");
    const album = useAppSelector(x => x.album);

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
            setGradientColor(hex);

        }
    }, [album])



    return (
        <div style={{ backgroundColor: gradientColor }}>
            <h1>Album</h1>
            {album.image && <img src={album.image} alt="Album cover" />}
            <p>{params.id}</p>
        </div>
    )
}