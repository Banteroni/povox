import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "../store"

// Define a type for the slice state
export interface StyleState {
    backgroundGradient: null | string
    searchTab: boolean
}

// Define the initial state using that type
const initialState: StyleState = {
    backgroundGradient: null,
    searchTab: false
}

export const styleSlice = createSlice({
    name: 'style',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setBackgroundGradient(state, action: PayloadAction<string>) {
            state.backgroundGradient = action.payload
        },
        toggleSearchTab(state) {
            state.searchTab = !state.searchTab
        }

    }
})

export const { setBackgroundGradient, toggleSearchTab } = styleSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectStyle = (state: RootState) => state.style

export default styleSlice.reducer