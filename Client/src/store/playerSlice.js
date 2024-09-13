import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    song: null,
    currTime:0,
    vol:0.5,
    playlist:null
}

const playerSlice = createSlice({
    initialState, 
    name:"player",
    reducers:{
        playSong:(state,action)=>{
            state.song = action.payload
            state.playlist = null
        },
        setCurrTime:(state,action)=>{
            state.currTime = action.payload.currTime
        },
        setVolume: (state,action)=>{
            state.vol = action.payload.volume
        },
        playPlaylist:(state,action)=>{
            state.song  =action.payload.song
            state.playlist = action.payload.playlist

        }
    }
})

export const {playSong,setCurrTime,setVolume, playPlaylist} = playerSlice.actions;
export default  playerSlice.reducer