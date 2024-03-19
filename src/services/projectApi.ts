import { Fetcher } from "swr";
import request from "~/services/axios";
import { IResponse } from "~/types/IResponse";


export const assignTeacherMentor = async (userNameStudent:string,userNameTeacher:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post(`/Project/assign-mentor?username_student=${userNameStudent}&username_teacher=${userNameTeacher}`,{
        
    });
    return data;
}