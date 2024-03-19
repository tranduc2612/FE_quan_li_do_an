import { Fetcher } from "swr";
import request from "~/services/axios";
import { IResponse } from "~/types/IResponse";
import { IScheduleSemester } from "~/types/IScheduleSemester";



export const getListScheduleSemester = async (idSemester: string): Promise<IResponse<IScheduleSemester[]>> => {
    const data: IResponse<IScheduleSemester[]> = await request.get("/ScheduleSemester/get-list-schedule-semester?semesterId="+idSemester,{
    });
    return data;
}

export const addScheduleSemester = async (dataReq: IScheduleSemester): Promise<IResponse<string>> => {
    const data: IResponse<string> = await request.post("/ScheduleSemester/add-schedule-semester",{
        ...dataReq
    });
    return data;
}

export const updateScheduleSemester = async (dataReq: IScheduleSemester): Promise<IResponse<IScheduleSemester>> => {
    const data: IResponse<IScheduleSemester> = await request.put("/ScheduleSemester/update-schedule-semester",{
        ...dataReq
    });
    return data;
}

export const deleteScheduleSemester = async (id:any): Promise<IResponse<any>> => {
    const data: IResponse<IScheduleSemester> = await request.delete("/ScheduleSemester/delete-schedule-semester?id="+id,{
    });
    return data;
}