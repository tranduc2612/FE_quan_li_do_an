import { ISemester } from "./ISemesterType";
import { IStudent } from "./IStudentType";
import { ITeacher } from "./ITeacherType";
import { IProjectOutline } from "./IProjectOutline";


export interface IProject{
    scoreFinal?: string,
    scoreUv1?: string,
    scoreMentor?: string,
    commentMentor?: string,
    commentCommentator?: string,
    scoreCommentator?: string,
    commentUv1?: string,
    scoreUv2?: string,
    commentUv2?: string,
    scoreUv3?: string,
    commentUv3?: string,
    scoreCt?: string,
    commentCt?: string,
    scoreTk?: string,
    commentTk?: string,
    semesterId?:string,

    nameFileFinal?: string,
    sizeFileFinal?: string,
    typeFileFinal?:string,

    councilId?:string,
    statusProject?:string,
    commentGroupReviewOutline?: string,
    userName?: string,
    userNameMentor?:string,
    userNameCommentator?:string,
    userNameCommentatorNavigation?: ITeacher,
    userNameMentorNavigation?: ITeacher,
    semester?: ISemester,
    userNameNavigation?:IStudent,
    projectOutline?:IProjectOutline,
    hashKeyMentor?:string,
    hashKeyCommentator?:string,
    council?:ICouncil
 }