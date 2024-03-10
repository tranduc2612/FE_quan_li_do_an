import { Fetcher } from "swr";
import request from "~/services/axios";
import { IPosts } from "~/types/IBlogType";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IStudent } from "~/types/IStudentType";


export const getListSemester = async (dataReq:ISemester): Promise<IResponse<ISemester>> => {
    const data: IResponse<ISemester> = await request.post("/Semester/get-list-semester",{
        ...dataReq
    });
    return data;
}