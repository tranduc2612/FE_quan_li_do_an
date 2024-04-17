import { Fetcher } from "swr";
import request from "~/services/axios";
import { IProjecType } from "~/types/IProjectType";
import { IResponse } from "~/types/IResponse";

export interface ScoreType {
    userName?: string,
    semesterId?: string,
    role?: string,
    score?: string,
    comment?: string
}

export interface IReqKeyHash {
    role?:string,
    key?:string

}

export const getListProjectByUsernameMentor = async (userNameTeacher?:string,semesterId?:string): Promise<IResponse<IProjecType[]>> => {
    const data: IResponse<IProjecType[]> = await request.get(`/Project/get-list-project-by-mentor?username_teacher=${userNameTeacher}&semesterId=${semesterId}`);
    return data;
}


export const assignTeacherMentor = async (userNameStudent:string,userNameTeacher:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post(`/Project/assign-mentor?username_student=${userNameStudent}&username_teacher=${userNameTeacher}`,{
        
    });
    return data;
}

export const assignCommentator = async (userNameStudent?:string,userNameTeacher?:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post(`/Project/assign-commentator?username_student=${userNameStudent}&username_teacher=${userNameTeacher}`,{
        
    });
    return data;
}

export const updateScore = async (req:ScoreType): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.put(`/Project/update-project-score`,{
        ...req
    });
    return data;
}

export const GetProjectByHashKey = async (req:IReqKeyHash): Promise<IResponse<IProjecType>> => {
    const data: IResponse<IProjecType> = await request.post("/Project/get-info-review-by-hash-key",{
        ...req
    });
    return data;
}