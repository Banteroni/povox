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
    queue: string[];
    past: string[];


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
    queue: [],
    past: [],
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
        },
        resetQueue(state) {
            state.queue = []
        },
        removeQueueTracks(state, action: PayloadAction<string[]>) {
            state.queue = state.queue.filter(x => !action.payload.includes(x))
        },
        addQueueTracks(state, action: PayloadAction<string[]>) {
            state.queue = state.queue = [...state.queue, ...action.payload]
        },
        setQueueTracks(state, action: PayloadAction<string[]>) {
            state.queue = action.payload
        },
        removePastTracks(state, action: PayloadAction<string[]>) {
            state.past = state.past.filter(x => !action.payload.includes(x))
        },
        addPastTracks(state, action: PayloadAction<string[]>) {
            state.past = state.past = [...state.past, ...action.payload]
        },
        setPastTracks(state, action: PayloadAction<string[]>) {
            state.past = action.payload
        }

    }
})

export const { setPlaying, setMusicBarTrack, resetQueue, removeQueueTracks, addQueueTracks, setQueueTracks, removePastTracks, addPastTracks, setPastTracks } = musicBarSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAlbum = (state: RootState) => state.musicBar

export default musicBarSlice.reducer