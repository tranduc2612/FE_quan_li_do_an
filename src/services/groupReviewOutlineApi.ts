import { Fetcher } from "swr";
import request from "~/services/axios";
import { IGroupReviewOutline } from "~/types/IGroupReviewOutline";
import { IResponse } from "~/types/IResponse";
import { ITeaching } from "~/types/ITeachingType";
import { IBaseList } from "~/types/IbaseList";

export interface AssignGroupReviewTeaching{
    groupReviewOutlineId?: string,
    usernameTeaching?: string[],
    semesterTeachingId?: string
}

export const getListReviewOutline = async (dataReq:any): Promise<IResponse<IBaseList<IGroupReviewOutline>>> => {
    const data: IResponse<IBaseList<IGroupReviewOutline>> = await request.post("/GroupReviewOutline/get-list-group-review-outline",{
        ...dataReq
    });
    return data;
}

export const getListTeachingSemester = async (dataReq:any): Promise<IResponse<ITeaching[]>> => {
    const data: IResponse<ITeaching[]> = await request.post("/GroupReviewOutline/get-list-teaching",{
        ...dataReq
    });
    return data;
}

export const getListReviewOutlineSemester = async (dataReq:any): Promise<IResponse<IGroupReviewOutline[]>> => {
    const data: IResponse<IGroupReviewOutline[]> = await request.post("/GroupReviewOutline/get-list-group-review-outline-semester",{
        ...dataReq
    });
    return data;
}

export const assginGroupReviewToTeaching = async (dataReq: AssignGroupReviewTeaching): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/GroupReviewOutline/assign-group-review-outline-to-teaching",{
        ...dataReq
    });
    return data;
}

export const addGroupReview = async (dataReq: IGroupReviewOutline): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.post("/GroupReviewOutline/add-group-review-outline",{
        ...dataReq
    });
    return data;
}

export const updateGroupReview = async (dataReq: IGroupReviewOutline): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.put("/GroupReviewOutline/update-group-review-outline",{
        ...dataReq
    });
    return data;
}


export const deleteGroupReview = async (id:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.delete("/GroupReviewOutline/delete-group-review-outline?id="+id,{
    });
    return data;
}