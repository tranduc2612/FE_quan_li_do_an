import { IProjectOutline } from "./IProjectOutline";
import { ITeacher } from "./ITeacherType";

export interface ICommentType{
    commentId?:string,
    contentComment?:string,
    createdBy?:string,
    userName?:string,
    createdDate?:string,
    createdByNavigation?:ITeacher,
    userNameNavigation?:IProjectOutline
}