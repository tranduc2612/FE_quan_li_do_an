import { Fetcher } from "swr";
import request from "~/services/axios";
import { IPosts } from "~/types/IBlogType";
import { IResponse } from "~/types/IResponse";
import { IStudent } from "~/types/IStudentType";
import { IBaseList } from "~/types/IbaseList";



export const addStudent = async (dataReq:IStudent): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/Auth/register-student",{
        ...dataReq
    });
    return data;
}

export const deleteStudent = async (userName:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.delete("/Student/delete-student?username="+userName,{
    });
    return data;
}

export const getListStudent = async (dataReq:any): Promise<IResponse<IBaseList<IStudent>>> => {
    const data: IResponse<IBaseList<IStudent>> = await request.post("/Student/get-list-student",{
        ...dataReq
    });
    return data;
}