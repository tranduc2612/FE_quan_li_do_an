import request from "~/services/axios";
import { IEducationType } from "~/types/IEducationType";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";


export const getListEducation = async (dataReq?:IEducationType): Promise<IResponse<IEducationType[]>> => {
    const data: IResponse<IEducationType[]> = await request.post("/Education/get-list-education",{
        ...dataReq
    });
    return data;
}

export const addEducation = async (dataReq:IEducationType): Promise<IResponse<IEducationType>> => {
    const data: IResponse<IEducationType> = await request.post("/Education/add-education",{
        ...dataReq
    });
    return data;
}

export const updateEducation = async (dataReq:IEducationType): Promise<IResponse<IEducationType>> => {
    const data: IResponse<IEducationType> = await request.put("/Education/update-education",{
        ...dataReq
    });
    return data;
}