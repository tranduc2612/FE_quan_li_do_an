import { IProjecType } from "./IProjectType";
import { ISemester } from "./ISemesterType";
import { ITeaching } from "./ITeachingType";

export interface ICouncil{
    councilId?: string,
    councilName?: string,
    councilZoom?: string,
    createdBy?: string,
    createdDate?: Date | string,
    isDelete?: number,
    semesterId?: string,
    projects?: IProjecType[],
    semester?: ISemester,
    teachings?: ITeaching[],
}

export interface ICouncilSemester{
    councilId?: string,
    councilName?: string,
    councilZoom?: string,
    createdBy?: string,
    createdDate?: Date | string,
    isDelete?: number,
    semesterId?: string,
    SLGV?:number,
    SLSV?:number
}