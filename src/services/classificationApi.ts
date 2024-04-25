import axios from "axios";
import request from "~/services/axios";
import { IClassificationType } from "~/types/IClassificationType";
import { IResponse } from "~/types/IResponse";
import { BASE_URL } from "~/ultis/contants";



export const getListClassification = async (dataReq:IClassificationType): Promise<IResponse<IClassificationType>> => {
    const data: IResponse<IClassificationType> = await request.get(`/Classification/get-list-classification?type_code=${dataReq.typeCode}`,{
        ...dataReq
    });
    return data;
}

export const dowloadFileTemplate = async (code:string): Promise<Blob> => {
    const data: Blob = await request.get(`/Printer/dowload-template-file?code=${code}`,
    {
        responseType: 'blob'
    }
    )
    return data;
}

export const updateFileTemplate = async (dataReq:FormData): Promise<IResponse<IClassificationType>> => {
    const data: IResponse<IClassificationType> = await axios.put(`${BASE_URL}Printer/update-template-file`,
    dataReq,
    { headers: { "Content-Type": "multipart/form-data" } });
    return data;
}