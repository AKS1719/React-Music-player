import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDrawerOpen: false
}

const drawerOpenSlice = createSlice({
    initialState,
    name:"drawerOpen",
    reducers:{
        openDrawer : (state)=>{
            state.isDrawerOpen = true
        },
        closeDrawer:(state)=>{
            state.isDrawerOpen = false

        }
    }
})

export const {openDrawer, closeDrawer} = drawerOpenSlice.actions
export default drawerOpenSlice.reducer