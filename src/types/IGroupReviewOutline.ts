export interface IGroupReviewOutline{
    groupReviewOutlineId?: string,
    nameGroupReviewOutline?: string,
    createdBy?:string,
    isDelete?: number,
    createdDate?: Date
}

export interface IGroupReviewOutlineSemester{
    groupReviewOutlineId?: string,
    nameGroupReviewOutline?: string,
    SLGV?:number,
    SLSV?:number
}