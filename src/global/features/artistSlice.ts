import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "../store"

// Define a type for the slice state
export interface ArtistState {
    id: null | string
    image: null | string
    name: null | string
    albums: {
        id: string,
        title: string,
        image: string
    }[]
}

// Define the initial state using that type
const initialState: ArtistState = {
    id: null,
    image: null,
    name: null,
    albums: []
}

export const artistSlice = createSlice({
    name: 'artist',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setArtist(state, action: PayloadAction<ArtistState>) {
            state.image = action.payload.image
            state.name = action.payload.name
            state.albums = action.payload.albums
            state.id = action.payload.id
        },
        setAlbums(state, action: PayloadAction<ArtistState["albums"]>) {
            state.albums = action.payload
        },
        cleanSet(state) {
            state.image = null
            state.name = null
            state.albums = []
            state.id = null
        }
    }
})

export const { setAlbums, setArtist, cleanSet } = artistSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectArtist = (state: RootState) => state.artist

export default artistSlice.reducer