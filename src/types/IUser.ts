import { ICouncil } from "./ICouncil";
import { IMajorType } from "./IMajorType";
import { IProjecType } from "./IProjectType";

export interface IUser {
    id?: string,
    userName?: string,
    email?: string,
    gender?: number,
    age?: number,
    phone?: number,
    dob?: string,
    address?: string,
    gpa?: string,
    className?:string,
    schoolYearName?:string,
    studentCode?: string,
    education?: string,
    fullName?: string,
    role?: "TEACHER" | "STUDENT" | "ALL" | "ADMIN",
    code?:string,
    avatar?:string,
    token?:string,
    semesterId?:string,
    refreshToken?:string,
    isAdmin?:number,
    isDelete?: number,
    status?:string,
    project?:IProjecType,
    major?: IMajorType,
    council?: ICouncil,
}