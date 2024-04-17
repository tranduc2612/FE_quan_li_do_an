import { IMajorType } from "./IMajorType";

export interface ITeacher {
    passwordText?: string,
    userName?: string,
    fullName?: string,
    dob?: Date,
    phone?: string,
    email?: string,
    avatar?: string,
    createdAt?: Date,
    createdBy?: string,
    status?: string,
    isAdmin?:string,
    majorId?: string,
    education?:string,
    address?: string,
    gender?:number,
    major?:IMajorType
}