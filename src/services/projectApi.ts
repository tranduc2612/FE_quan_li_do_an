import { Fetcher } from "swr";
import request from "~/services/axios";
import { IProjecType } from "~/types/IProjectType";
import { IResponse } from "~/types/IResponse";

export const getListProjectByUsernameMentor = async (userNameTeacher?:string,semesterId?:string): Promise<IResponse<IProjecType[]>> => {
    const data: IResponse<IProjecType[]> = await request.get(`/Project/get-list-project-by-mentor?username_teacher=${userNameTeacher}&semesterId=${semesterId}`);
    return data;
}


export const assignTeacherMentor = async (userNameStudent:string,userNameTeacher:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post(`/Project/assign-mentor?username_student=${userNameStudent}&username_teacher=${userNameTeacher}`,{
        
    });
    return data;
}