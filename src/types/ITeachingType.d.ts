import { ICouncil } from "./ICouncil";
import { ISemester } from "./ISemesterType";
import { ITeacher } from "./ITeacherType";
import {IGroupReviewOutline} from "./IGroupReviewOutline"

export interface ITeaching {
    positionInCouncil?: string,
    userNameTeacher?: string,
    semesterId?: string,
    groupReviewOutlineId?: string,
    councilId?: string,
    groupReviewOutline?: IGroupReviewOutline,
    semester?: ISemester,
    council?:ICouncil,
    userNameTeacherNavigation?:ITeacher
}