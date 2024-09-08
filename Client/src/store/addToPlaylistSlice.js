import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isAddToPlaylist :false,
    song :null
}

const addToPlaylistSlice = createSlice({
    initialState,
    name:"signup",
    reducers:{
        markAddToPlaylist: (state,action)=>{
            state.isAddToPlaylist = true
            state.song=null
        },
        markNotAddToPlaylist: (state)=>{
            state.isAddToPlaylist = false
            state.song = null
        },
        markAddToPlaylistWithSong:(state,action)=>{
            state.isAddToPlaylist=true
            state.song = action.payload
        }
    }
})

export const {markAddToPlaylist,markNotAddToPlaylist, markAddToPlaylistWithSong} = addToPlaylistSlice.actions
export default addToPlaylistSlice.reducer