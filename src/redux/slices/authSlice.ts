import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";
import request, { BASE_URL_MEDIA } from "~/services/axios";
import { BASE_URL } from "~/ultis/contants";

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
    password?: string,
    role?: "STUDENT" | "TEACHER"
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
        userName: undefined,
        email: undefined,
        gender: undefined,
        fullName: undefined,
        role:undefined,
        code:undefined,
        avatar:undefined,
        token:undefined,
    }
}

// --- Tạo thunk ---
export const refreshToken = createAsyncThunk(
    'task/addTask',
    async (refresh_token: any) => {
        // check
        const response:any = request.post('/Auth/refresh-token',refresh_token)
            .then((res:any)=>{
                const userData:IUser = res.returnObj;
        
                if(userData.token && userData.refreshToken){
                    localStorage.setItem('access_token', userData.token)
                    localStorage.setItem('refresh_token',userData.refreshToken)
                }
                console.log(userData);
                return userData;
            }).catch((error)=>{
                console.log(error);
                localStorage.clear();

                return error
            })
            return response;
    //   const response:IUser = await new Promise((resolve) =>
    //   // --- Gọi API ---

    //     setTimeout(() => resolve(JSON.parse(atob(token.split('.')[1]))), 1000)
    //   );
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
                if (action.payload.code != 'ERR_BAD_REQUEST') {
                    state.isLogin = true
                    state.infoData = action.payload
                }
                else {
                    localStorage.clear();
                }
           })
           .addCase(refreshToken.rejected, (state) => {
                state.infoData = undefined,
                state.loginError.messageError = ""
                state.loginError.typeError = ""
                state.logging = false
                state.isLogin = false
            })
           
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