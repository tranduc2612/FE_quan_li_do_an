import { Fetcher } from "swr";
import request from "~/services/axios";
import { IPosts } from "~/types/IBlog";

export const getAllPosts = async () => {
    const data:any = await request.get("/posts");
    return data;
}

export const handlePosts = async (dataReq:IPosts) => {
    const data: IPosts[] = await request.post("/posts",{
        ...dataReq
    });
    return data;
}