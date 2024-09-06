import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoginComponent :false
}

const loginSlice = createSlice({
    initialState,
    name:"login",
    reducers:{
        markLogin: (state)=>{
            state.isLoginComponent = true
        },
        markNotLogin: (state)=>{
            state.isLoginComponent = false
        }
    }
})

export const {markLogin, markNotLogin} = loginSlice.actions
export default loginSlice.reducer