import { configureStore } from "@reduxjs/toolkit"
import auth from "./authSlice.js"
import search from "./searchSlice.js"
import loginPage from "./loginSlice.js"
import signupPage from "./signupSlice.js"
import player from "./playerSlice.js"
const store = configureStore(
    {
        reducer: {
            auth,
            search,
            loginPage,
            signupPage,
            player
        }
    }
)

export default store