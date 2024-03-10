import request from "~/services/axios";
import { IClassificationType } from "~/types/IClassificationType";
import { IResponse } from "~/types/IResponse";


export const getListClassification = async (dataReq:IClassificationType): Promise<IResponse<IClassificationType>> => {
    const data: IResponse<IClassificationType> = await request.get(`/Classification/get-list-classification?type_code=${dataReq.typeCode}`,{
        ...dataReq
    });
    return data;
}