import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    song: null,
    currTime:0,
    vol:0.5,
}

const playerSlice = createSlice({
    initialState, 
    name:"player",
    reducers:{
        playSong:(state,action)=>{
            state.song = action.payload
        },
        setCurrTime:(state,action)=>{
            state.currTime = action.payload.currTime
        },
        setVolume: (state,action)=>{
            state.vol = action.payload.volume
        }
    }
})

export const {playSong,setCurrTime,setVolume} = playerSlice.actions;
export default  playerSlice.reducer