import { NavigateFunction } from "react-router-dom";
import Album from "../models/Album";
import { setAlbum } from "../global/features/albumSlice";
import { Dispatch, UnknownAction } from "redux";
import Artist from "../models/Artist";
import { setArtist } from "../global/features/artistSlice";

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

export function RouteToArtist(artist: Artist, navigate: NavigateFunction, dispatch: Dispatch<UnknownAction>) {
    dispatch(setArtist({
        id: artist.id,
        name: artist.name,
        albums: [],
        image: artist.coverArt,
    }))
    navigate("/artists/" + artist.id);
}