import { ISemester } from "./ISemesterType";
import { IStudent } from "./IStudentType";
import { ITeacher } from "./ITeacherType";

export interface IProjecType{
    scoreFinal?: string,
    score1?: string,
    scoreMentor?: string,
    commentMentor?: string,
    commentCommentator?: string,
    scoreCommentator?: string,
    comment1?: string,
    score2?: string,
    comment2?: string,
    score3?: string,
    comment3?: string,
    semesterId?:string,
    commentGroupReviewOutline?: string,
    userName?: string,
    userNameMentor?:string,
    userNameCommentator?:string,
    userNameCommentatorNavigation?: ITeacher,
    userNameMentorNavigation?: ITeacher,
    projectOutline?: string,
    semester?: ISemester,
    userNameNavigation?:IStudent
 }