import { Fetcher } from "swr";
import request from "~/services/axios";
import { IPosts } from "~/types/IBlogType";
import { IReqList } from "~/types/IReqList";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IStudent } from "~/types/IStudentType";
import { IBaseList } from "~/types/IbaseList";

export const getSemester = async (id:string): Promise<IResponse<ISemester>> => {
    const data: IResponse<ISemester> = await request.get("/Semester/get-semester?idSemester="+id);
    return data;
}

export const getListSemester = async (dataReq:ISemester): Promise<IResponse<ISemester[]>> => {
    const data: IResponse<ISemester[]> = await request.post("/Semester/get-list-semester",{
        ...dataReq
    });
    return data;
}

export const getListPageSemester = async (dataReq:IReqList & ISemester): Promise<IResponse<IBaseList<any>>> => {
    const data: IResponse<IBaseList<any>> = await request.post("/Semester/get-list-page-semester",{
        ...dataReq
    });
    return data;
}

export const addSemester = async (dataReq: ISemester): Promise<IResponse<ISemester>> => {
    const data: IResponse<ISemester> = await request.post("/Semester/add-semester",{
        ...dataReq
    });
    return data;
}