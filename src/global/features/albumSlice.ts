import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "../store"

// Define a type for the slice state
export interface AlbumState {
    id: null | string
    image: null | string
    artist: null | string
    title: null | string
    tracks: {
        id: string,
        title: string,
        duration: number,
        trackNumber: number
    }[]
}

// Define the initial state using that type
const initialState: AlbumState = {
    id: null,
    image: null,
    artist: null,
    title: null,
    tracks: []
}

export const albumSlice = createSlice({
    name: 'album',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setAlbum(state, action: PayloadAction<AlbumState>) {
            state.image = action.payload.image
            state.title = action.payload.title
            state.artist = action.payload.artist
            state.tracks = action.payload.tracks
        },
        setTracks(state, action: PayloadAction<AlbumState["tracks"]>) {
            state.tracks = action.payload
        },
        cleanSet(state) {
            state.image = null
            state.title = null
            state.artist = null
            state.tracks = []
        }
    }
})

export const { setAlbum, setTracks, cleanSet } = albumSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAlbum = (state: RootState) => state.album

export default albumSlice.reducer