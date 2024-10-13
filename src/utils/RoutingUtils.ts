import { NavigateFunction } from "react-router-dom";
import Album from "../models/Album";
import { setAlbum } from "../global/features/albumSlice";
import { Dispatch, UnknownAction } from "redux";

export function RouteToAlbum(album: Album, navigate: NavigateFunction, dispatch: Dispatch<UnknownAction>) {
    dispatch(setAlbum({
        id: album.id,
        title: album.album,
        artist: album.artist,
        tracks: [],
        image: album.coverArt,
    }))
    navigate("/albums/" + album.id);
}