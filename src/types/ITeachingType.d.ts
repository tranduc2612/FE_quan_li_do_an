import { ISemester } from "./ISemesterType";
import { ITeacher } from "./ITeacherType";

export interface ITeaching {
    postionInCouncil?: string,
    userNameTeacher?: string,
    semesterId?: string,
    groupReviewOutlineId?: string,
    councilId?: string,
    groupReviewOutline?: IGroupReviewOutline,
    semester?: ISemester,
    userNameTeacherNavigation?:ITeacher
}