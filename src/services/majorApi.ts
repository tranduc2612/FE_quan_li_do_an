import request from "~/services/axios";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";


export const getListMajor = async (dataReq:IMajorType): Promise<IResponse<IMajorType>> => {
    const data: IResponse<IMajorType> = await request.post("/Major/get-list-major",{
        ...dataReq
    });
    return data;
}