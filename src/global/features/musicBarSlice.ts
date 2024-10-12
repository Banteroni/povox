import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Track from "../../models/Track";
import { RootState } from "../store";


export interface musicBarState {
    isPlaying: boolean;
    volume: number;
    coverArt: string | null;
    trackName: string | null;
    trackId: string | null;
    albumName: string | null;
    albumId: string | null;
    artist: string | null;
    artistId: string | null;
    duration: number;


}

// Define the initial state using that type
const initialState: musicBarState = {
    isPlaying: false,
    volume: 50,
    coverArt: null,
    trackName: null,
    trackId: null,
    albumName: null,
    albumId: null,
    artist: null,
    artistId: null,
    duration: 0,
}

export const musicBarSlice = createSlice({
    name: 'musicBar',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setPlaying(state, action: PayloadAction<boolean>) {
            state.isPlaying = action.payload
        },
        setMusicBarTrack(state, action: PayloadAction<Track>) {
            if (action.payload.coverArt !== undefined) {
                state.coverArt = action.payload.coverArt
            }
            state.trackName = action.payload.title
            state.trackId = action.payload.id
            state.albumName = action.payload.album
            state.albumId = action.payload.albumId
            state.artist = action.payload.artist
            state.artistId = action.payload.artistId
            state.duration = action.payload.duration
        }
    }
})

export const { setPlaying, setMusicBarTrack } = musicBarSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAlbum = (state: RootState) => state.musicBar

export default musicBarSlice.reducer