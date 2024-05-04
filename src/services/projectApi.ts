import axios from "axios";
import { Fetcher } from "swr";
import request from "~/services/axios";
import { IProject } from "~/types/IProjectType";
import { IResponse } from "~/types/IResponse";
import { BASE_URL } from "~/ultis/contants";

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

export const getListProjectByUsername = async (userName?:string): Promise<IResponse<IProject>> => {
    const data: IResponse<IProject> = await request.get(`/Project/get-project-by-username?username=${userName}`);
    return data;
}



export const getListProjectByUsernameMentor = async (userNameTeacher?:string,semesterId?:string): Promise<IResponse<IProject[]>> => {
    const data: IResponse<IProject[]> = await request.get(`/Project/get-list-project-by-mentor?username_teacher=${userNameTeacher}&semesterId=${semesterId}`);
    return data;
}

export const handleUploadFileFinal = async (dataReq:FormData): Promise<IResponse<IProject>> => {
    const data: IResponse<IProject> = await axios.post(`${BASE_URL}Project/handle-upload-file-final-project`,
    dataReq,
    { headers: { "Content-Type": "multipart/form-data" } });
    return data;
}


export const assignTeacherMentor = async (userNameStudent:string,userNameTeacher:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post(`/Project/assign-mentor?username_student=${userNameStudent}&username_teacher=${userNameTeacher}`,{
        
    });
    return data;
}

export const autoTeacherMentor = async (req: {semesterId: string}): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post(`/Project/auto-assign-mentor?semesterId=${req.semesterId}`,{
        ...req
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

export const GetProjectByHashKey = async (req:IReqKeyHash): Promise<IResponse<IProject>> => {
    const data: IResponse<IProject> = await request.post("/Project/get-info-review-by-hash-key",{
        ...req
    });
    return data;
}

export const downloadFileWord = async (req:IReqKeyHash): Promise<any> => {
    const data: IResponse<any> = await request.post(`/Printer/print-word-review`,
    {
        ...req
    },
    {
        responseType: 'blob'
    }
    )
    return data;
}

export const dowloadFileProjectFinal = async (userName:string): Promise<Blob> => {
    const data: Blob = await request.get(`/Project/dowload-file-project-final?Username=${userName}`,
    {
        responseType: 'blob'
    }
    )
    return data;
}