import axios from "axios";
import request from "~/services/axios";
import { IResponse } from "~/types/IResponse";
import { IUser } from "~/types/IUser";
import { BASE_URL } from "~/ultis/contants";

export interface changePasswordModel {
    userName?: string,
    passwordOld?: string,
    passwordNew?: string,
    role?: string
}

export const GetProfileUser = async (username:string): Promise<IResponse<IUser>> => {
    const data: IResponse<IUser> = await request.get("/Auth/get-profile?username="+username,{
    });
    return data;
}

export const changePassword = async (dataReq:changePasswordModel): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/Auth/change-password",{
        ...dataReq
    });
    return data;
}

export const changeAvatar = async (dataReq:FormData): Promise<IResponse<any>> => {
    const data: IResponse<any> = await axios.post(`${BASE_URL}Auth/change-avatar`,
    dataReq,
    { headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
}

export const getFileAvatar = async (role?:string,username?:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await axios.get(`${BASE_URL}Auth/avatar?role=${role}&username=${username}`,
    {
        responseType: 'blob'
    }
);
    return data;
}

