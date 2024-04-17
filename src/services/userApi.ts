import { Fetcher } from "swr";
import request from "~/services/axios";
import { IResponse } from "~/types/IResponse";
import { IStudent } from "~/types/IStudentType";
import { IUser } from "~/types/IUser";



export const GetProfileUser = async (username:string): Promise<IResponse<IUser>> => {
    const data: IResponse<IUser> = await request.get("/Auth/get-profile?username="+username,{
    });
    return data;
}

