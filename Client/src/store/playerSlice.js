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
        }
    }
})

export const {playSong} = playerSlice.actions;
export default  playerSlice.reducer