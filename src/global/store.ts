import { configureStore } from '@reduxjs/toolkit'
import { albumSlice } from './features/albumSlice'
import { styleSlice } from './features/styleSlice'

export const store = configureStore({
    reducer: {
        album: albumSlice.reducer,
        style: styleSlice.reducer
    },
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store