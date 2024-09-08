import { configureStore } from "@reduxjs/toolkit"
import auth from "./authSlice.js"
import search from "./searchSlice.js"
import loginPage from "./loginSlice.js"
import signupPage from "./signupSlice.js"
import player from "./playerSlice.js"
import drawerOpen from "./drawerOpen.js"
import addToPlaylist from "./addToPlaylistSlice.js"
const store = configureStore(
    {
        reducer: {
            auth,
            search,
            loginPage,
            signupPage,
            player,
            drawerOpen,
            addToPlaylist
        }
    }
)

export default store