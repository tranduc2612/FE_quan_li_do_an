import request from "~/services/axios";
import { ICommentType } from "~/types/IComment";
import { IResponse } from "~/types/IResponse";


export const checkPermission = async (usernameOutline:string,usernameTeacher:string,semesterId:string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await 
    request.get(
        `/Comment/check-permisstion-comment?usernameOutline=${usernameOutline}&usernameTeacher=${usernameTeacher}&semesterId=${semesterId}`
        );
    return data;
}

export const getListCommentOutline = async (username:string): Promise<IResponse<ICommentType[]>> => {
    const data: IResponse<ICommentType[]> = await request.get("/Comment/get-list-comment?username="+username);
    return data;
}

export const addCommentOutline = async (req: ICommentType): Promise<IResponse<ICommentType>> => {
    const data: IResponse<ICommentType> = await request.post("/Comment/add-comment",{
        ...req
    });
    return data;
}

export const updateCommentOutline = async (req: ICommentType): Promise<IResponse<ICommentType>> => {
    const data: IResponse<ICommentType> = await request.put("/Comment/update-comment",{
        ...req
    });
    return data;
}

export const deleteCommentOutline = async (id: string): Promise<IResponse<any>> => {
    const data: IResponse<any> = await request.delete("/Comment/delete-comment?id_comment="+id);
    return data;
}