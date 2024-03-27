import { ICommentType } from "./IComment";
import { IGroupReviewOutline } from "./IGroupReviewOutline";
import { IProjecType } from "./IProjectType";
import { ITeacher } from "./ITeacherType";

export interface IProjectOutline{
        userName?:string,
        nameProject?:string,
        plantOutline?:string,
        techProject?:string,
        expectResult?:string,
        contentProject?:string,
        comments?: ICommentType[],
        groupReviewOutline?:IGroupReviewOutline,
        userNameNavigation?: IProjecType,

 }