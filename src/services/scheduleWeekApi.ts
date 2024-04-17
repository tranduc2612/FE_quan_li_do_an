import axios from "axios";
import { Fetcher } from "swr";
import request from "~/services/axios";
import { IDetailScheduleWeek } from "~/types/IDetailScheduleWeek";
import { IResponse } from "~/types/IResponse";
import { IScheduleWeek } from "~/types/IScheduleWeek";
import { BASE_URL } from "~/ultis/contants";

export const getScheduleWeek = async (id: string): Promise<IResponse<IScheduleWeek>> => {
    const data: IResponse<IScheduleWeek> = await request.get("/ScheduleWeek/get-schedule-Week?id="+id,{
    });
    return data;
}

export const getListScheduleWeek = async (idScheduleWeek?: string,idTeacher?:string): Promise<IResponse<IScheduleWeek[]>> => {
    const data: IResponse<IScheduleWeek[]> = await request.get(`/ScheduleWeek/get-list-schedule-week?idSemester=${idScheduleWeek}&idUserCreated=${idTeacher}`,{
    });
    return data;
}

export const addScheduleWeek = async (dataReq: IScheduleWeek): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/ScheduleWeek/add-schedule-week",{
        ...dataReq
    });
    return data;
}

export const updateScheduleWeek = async (dataReq: IScheduleWeek): Promise<IResponse<IScheduleWeek>> => {
    const data: IResponse<IScheduleWeek> = await request.put("/ScheduleWeek/update-schedule-Week",{
        ...dataReq
    });
    return data;
}

export const deleteScheduleWeek = async (id:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.delete("/ScheduleWeek/delete-schedule-Week?id="+id);
    return data;
}

export const updateCommentScheduleWeek = async (ScheduleWeekId:string,UserNameProject:string,Comment:string): Promise<IResponse<IScheduleWeek>> => {
    const data: IResponse<IDetailScheduleWeek> = await request.put(`/ScheduleWeek/update-comment-schedule-week?ScheduleWeekId=${ScheduleWeekId}&UserNameProject=${UserNameProject}&Comment=${Comment}`,{
        
    });
    return data;
}

export const getScheduleWeekDetail = async (userName:string,idSchedule:string): Promise<IResponse<IDetailScheduleWeek>> => {
    const data: IResponse<IDetailScheduleWeek> = await request.get(`/ScheduleWeek/get-detail-schedule-week?userName=${userName}&idSchedule=${idSchedule}`,{
    });
    return data;
}

export const handleScheduleWeekDetail = async (dataReq:FormData): Promise<IResponse<IDetailScheduleWeek>> => {
    const data: IResponse<IDetailScheduleWeek> = await axios.post(`${BASE_URL}ScheduleWeek/handle-detail-schedule-week`,
    dataReq,
    { headers: { "Content-Type": "multipart/form-data" } });
    return data;
}

export const dowloadScheduleWeekDetail = async (userName:string,idSchedule:string): Promise<Blob> => {
    const data: Blob = await request.get(`/ScheduleWeek/dowload-file-schedule-week?ScheduleWeekId=${idSchedule}&UserNameProject=${userName}`,
    {
        responseType: 'blob'
    }
    )
    return data;
}