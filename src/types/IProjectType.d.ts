import { ISemester } from "./ISemesterType";

export interface IProjecType{
    scoreFinal?: string,
    scoreUv1?: string,
    scoreGvhd?: string,
    scoreGvpb?: string,
    commentUv1?: string,
    scoreUv2?: string,
    commentUv2?: string,
    scoreUv3?: string,
    commentUv3?: string,
    commentGroupReviewOutline?: string,
    userName?: string,
    userNameCommentatorNavigation?: string,
    userNameMentorNavigation?: string,
    projectOutline?: string,
    semester?: ISemester
 }