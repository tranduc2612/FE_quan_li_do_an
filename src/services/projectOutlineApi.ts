import { Fetcher } from "swr";
import request from "~/services/axios";
import { IProjectOutline } from "~/types/IProjectOutline";
import { IResponse } from "~/types/IResponse";


export const getProjectOutline = async (userNameStudent:string): Promise<IResponse<IProjectOutline>> => {
    const data: IResponse<IProjectOutline> = await request.get(`/Project/get-project-outline-id?id=`+userNameStudent,{
        
    });
    return data;
}

export const addProjectOutline = async (projectOutline:IProjectOutline): Promise<IResponse<IProjectOutline>> => {
    const data: IResponse<IProjectOutline> = await request.post(`/Project/add-project-outline`,{
        ...projectOutline
    });
    return data;
}

export const updateProjectOutline = async (projectOutline:IProjectOutline): Promise<IResponse<IProjectOutline>> => {
    const data: IResponse<IProjectOutline> = await request.put(`/Project/update-project-outline`,{
        ...projectOutline
    });
    return data;
}