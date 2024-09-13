import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toShowSong:false
}

const showListSlice = createSlice({
    name:"showSongList",
    initialState,
    reducers:{
        showList:(state)=>{
            state.toShowSong = true
        },
        hideList:(state)=>{
            state.toShowSong=false
        }
    }
})

export const {showList, hideList} = showListSlice.actions
export default showListSlice.reducer