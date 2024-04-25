import request from "~/services/axios";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";


export const getListMajor = async (dataReq:IMajorType): Promise<IResponse<IMajorType[]>> => {
    const data: IResponse<IMajorType[]> = await request.post("/Major/get-list-major",{
        ...dataReq
    });
    return data;
}

export const addMajor = async (dataReq:IMajorType): Promise<IResponse<IMajorType>> => {
    const data: IResponse<IMajorType> = await request.post("/Major/add-major",{
        ...dataReq
    });
    return data;
}

export const updateMajor = async (dataReq:IMajorType): Promise<IResponse<IMajorType>> => {
    const data: IResponse<IMajorType> = await request.put("/Major/update-major",{
        ...dataReq
    });
    return data;
}