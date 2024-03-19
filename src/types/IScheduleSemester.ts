import { ISemester } from "./ISemesterType"
import { ITeacher } from "./ITeacherType"

export interface IScheduleSemester{   
        scheduleSemesterId?:string,
        fromDate?:Date | string,
        toDate?:Date | string,
        typeSchedule?:string, 
        semesterId?:string,
        createdBy?:string,
        createdDate?:Date,
        implementer?:string,
        content?:string,
        note?:string,
        createdByNavigation?:ITeacher,
        semester?:ISemester
}