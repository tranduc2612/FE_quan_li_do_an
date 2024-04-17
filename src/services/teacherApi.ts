import { Fetcher } from "swr";
import request from "~/services/axios";
import { IResponse } from "~/types/IResponse";
import { ITeacher } from "~/types/ITeacherType";
import { IBaseList } from "~/types/IbaseList";


export const addTeacher = async (dataReq:ITeacher): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/Auth/register-teacher",{
        ...dataReq
    });
    return data;
}

export const updateTeacher = async (dataReq:ITeacher): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.put("/Teacher/update-teacher",{
        ...dataReq
    });
    return data;
}

export const deleteTeacher = async (userName:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.delete("/Teacher/delete-teacher?username="+userName,{
    });
    return data;
}

export const getListTeacher = async (dataReq:any): Promise<IResponse<IBaseList<ITeacher>>> => {
    const data: IResponse<IBaseList<ITeacher>> = await request.post("/Teacher/get-list-teacher",{
        ...dataReq
    });
    return data;
}