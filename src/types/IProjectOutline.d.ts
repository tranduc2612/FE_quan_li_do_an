import { ICommentType } from "./IComment";
import { IGroupReviewOutline } from "./IGroupReviewOutline";
import { IProject } from "./IProjectType";
import { ITeacher } from "./ITeacherType";

export interface IProjectOutline{
        userName?:string,
        nameProject?:string,
        plantOutline?:string,
        techProject?:string,
        expectResult?:string,
        contentProject?:string,
        groupReviewOutlineId?:string,
        semesterId?:string,
        comments?: ICommentType[],
        groupReviewOutline?:IGroupReviewOutline,
        userNameNavigation?: IProject,

 }