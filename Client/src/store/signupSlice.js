import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isSignInComponent :false
}

const signupSlice = createSlice({
    initialState,
    name:"signup",
    reducers:{
        marksigningIn: (state)=>{
            state.isSignInComponent = true
        },
        markNotsigninIn: (state)=>{
            state.isSignInComponent = false
        }
    }
})

export const {markNotsigninIn, marksigningIn} = signupSlice.actions
export default signupSlice.reducer