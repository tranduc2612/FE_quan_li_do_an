import axios from "axios";
import request from "~/services/axios";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";
import { IBaseList } from "~/types/IbaseList";
import { BASE_URL } from "~/ultis/contants";


export const getTemplateFileAddStudent = async (): Promise<Blob> => {
    const data: Blob = await request.get(`/Auth/get-file-mau-add-student`,
    {
        responseType: 'blob'
    }
    )
    return data;
}

export const getExcelListStudent = async (dataReq:any): Promise<any> => {
    const data: any = await request.post(`/Report/export-excel-list-student`,
    {
        ...dataReq
    },
    {
        responseType: 'blob'
    }
    )
    return data;
}

export const getExcelListTeacher = async (dataReq:any): Promise<any> => {
    const data: any = await request.post(`/Report/export-excel-list-teacher`,
    {
        ...dataReq
    },
    {
        responseType: 'blob'
    }
    )
    return data;
}

export const uploadFileAddStudent = async (dataReq:FormData): Promise<IResponse<any>> => {
    const data: IResponse<any> = await axios.post(`${BASE_URL}Auth/register-student-list-excel`,
    dataReq,
    { headers: { "Content-Type": "multipart/form-data" },
      responseType: 'blob' 
    });
    return data;
}