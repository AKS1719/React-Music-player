import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    forPage: null,
    searchData: null
}

const searchSlice = createSlice(
    {
        name: "search",
        initialState,
        reducers: {
            searched: (state, action) => {
                state.forPage = action.payload.forPage
                state.searchData = action.payload.searchData
            }
        }
    }
)

export const { searched } = searchSlice.actions
export default searchSlice.reducer