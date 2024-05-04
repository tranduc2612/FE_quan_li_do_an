import { Fetcher } from "swr";
import request from "~/services/axios";
import { IPosts } from "~/types/IBlogType";
import { ICouncil, ICouncilSemester } from "~/types/ICouncil";
import { IProject } from "~/types/IProjectType";
import { IReqList } from "~/types/IReqList";
import { IResponse } from "~/types/IResponse";
import { ITeaching } from "~/types/ITeachingType";


export interface AssignCouncilTeaching{
    councilId?: string,
    usernameTeaching?: string,
    semesterTeachingId?: string,
    positionInCouncil?:string
}

export interface AssignCouncilProject{
    semesterId?: string,
    councilId?: string,
    usernameProjects?: string[]
  }

export interface ListProjectCouncil{
    semesterId?: string,
    councilId?: string
  }

export const getCouncil = async (id: string): Promise<IResponse<ICouncil>> => {
    const data: IResponse<ICouncil> = await request.get("/Council/get-council?id="+id);
    return data;
}

export const getTeaching = async (username?: string,semesterId?: string): Promise<IResponse<ITeaching>> => {
    const data: IResponse<ITeaching> = await request.get(`/Council/get-teaching?username=${username}&semesterId=${semesterId}`);
    return data;
}

export const getListProjectCouncil = async (dataReq: ListProjectCouncil): Promise<IResponse<IProject[]>> => {
    const data: IResponse<IProject[]> = await request.post("/Council/get-list-project-council",{
        ...dataReq
    });
    return data;
}

export const excelListProjectCouncil = async (dataReq: ListProjectCouncil): Promise<IResponse<any>> => {
    const data: any = await request.post(`/Report/export-excel-council-by-id`,
    {
        ...dataReq
    },
    {
        responseType: 'blob'
    }
    )
    return data;
}

export const getListTeachingCouncil = async (dataReq: any): Promise<IResponse<ITeaching[]>> => {
    const data: IResponse<ITeaching[]> = await request.post("/Council/get-list-teaching-in-council",{
        ...dataReq
    });
    return data;
}

export const lstCouncilSemester = async (dataReq: ICouncil): Promise<IResponse<ICouncilSemester[]>> => {
    const data: IResponse<ICouncilSemester[]> = await request.post("/Council/get-list-council-semester",{
        ...dataReq
    });
    return data;
}

export const addCouncil = async (dataReq: ICouncilSemester): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/Council/add-council",{
        ...dataReq
    });
    return data;
}

export const AutoSplitCouncil = async (semesterId: string,currentUser: string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post(`/Council/auto-assign-council?semesterId=${semesterId}&currentUsername=${currentUser}`,{
        // ...dataReq
    });
    return data;
}

export const updateCouncil = async (dataReq: ICouncilSemester): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.put("/Council/update-council",{
        ...dataReq
    });
    return data;
}

export const deleteCouncil = async (id: string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.delete("/Council/delete-council?id="+id,{
    });
    return data;
}

export const assginCouncilToTeaching = async (dataReq: AssignCouncilTeaching): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/Council/assign-council-to-teaching",{
        ...dataReq
    });
    return data;
}

export const assginCouncilToProject = async (dataReq: AssignCouncilTeaching): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/Council/assign-council-to-project",{
        ...dataReq
    });
    return data;
}