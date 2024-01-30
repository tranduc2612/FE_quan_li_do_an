import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IUserInfo{
    isLogin: boolean,
    logging: boolean,
    isError: boolean,
    loginError: {
        messageError: string,
        typeError: string,
    }
    infoData?: IUser
}

export interface IErrorPayload{
    typeError: string,
    messageError: string,
}

export interface ILoginPayload{
    username?: string,
    password?: string
}

const initialUser: IUserInfo = {
    isLogin: false,
    logging: false,
    isError: false,
    loginError:{
        messageError: "",
        typeError:"",
    },
    
    infoData: {
        id: undefined,
        username: undefined,
        email: undefined,
        gender: undefined,
        firstName: undefined,
        lastName: undefined,
        image: undefined,
        token: undefined,
    }
}

// --- Tạo thunk ---
export const refreshToken = createAsyncThunk(
    'task/addTask',
    async (token: string) => {
        // check 
      const response:IUser = await new Promise((resolve) =>
      // --- Gọi API ---
        
        setTimeout(() => resolve({ 
            lastName: ""
         }), 1000)
      );
      return response;
    }
  );
  


const authSlice = createSlice({
    name: 'auth',
    initialState: initialUser,
    reducers: {
        login(state,action: PayloadAction<ILoginPayload>){
            state.logging = true
        },
        loginSucces(state, action: PayloadAction<IUser>){
            state.isLogin = true
            state.logging = false
            state.infoData = action.payload
        },
        loginFailed(state,action: PayloadAction<IErrorPayload>){
            state.isLogin = false
            state.logging = false
            state.isError = true
            state.loginError.messageError = action.payload.messageError
            state.loginError.typeError = action.payload.typeError
            state.infoData = undefined
        },
        logout(state){
            state.infoData = undefined,
            state.loginError.messageError = ""
            state.loginError.typeError = ""
            state.logging = false
            state.isLogin = false
        }
    },
    extraReducers: (builder) => {
        // --- Xử lý trong reducer với case pending / fulfilled / rejected ---
         builder
           .addCase(refreshToken.pending, (state) => {
                state.logging = true
           })
           .addCase(refreshToken.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.logging = false
                state.isLogin = true
                state.infoData = action.payload
           });
       }
})

export const {login,logout,loginSucces,loginFailed} = authSlice.actions

export const isLogin = (state:RootState) => state.auth.isLogin
export const isError = (state:RootState) => state.auth.isError
export const logging = (state:RootState) => state.auth.logging
export const errorLogging = (state:RootState) => state.auth.loginError 
export const inforUser = (state:RootState) => state.auth.infoData 


const authReducer = authSlice.reducer;
export default authReducer;