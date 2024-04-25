import { ITeaching } from "./ITeachingType"

export interface IGroupReviewOutline{
    groupReviewOutlineId?: string,
    nameGroupReviewOutline?: string,
    createdBy?:string,
    isDelete?: number,
    createdDate?: Date,
    semesterId?:string,
    teachings?:ITeaching[]
}

export interface IGroupReviewOutlineSemester{
    groupReviewOutlineId?: string,
    nameGroupReviewOutline?: string,
    SLGV?:number,
    SLSV?:number
}