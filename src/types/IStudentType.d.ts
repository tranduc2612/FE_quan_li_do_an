import { IProject } from "./IProjectType";
import { ISemester } from "./ISemesterType";

export interface IStudent {
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
    studentCode?: string,
    className?: string,
    majorId?: string,
    schoolYearName?: string,
    address?:string,
    statusProject?:string,// thêm vào đây để lấy cho dễ
    gender?:number,
    isDelete?:string,
    userNameMentorRegister?:string,
    isFirstTime?:number,
    semesterId?:string, //Thêm vào đây để có những form gửi lên thì cần ID học kỳ, chứ update thì ko lấy được thằng này đâu vì API ko trả về
    major?: IMajorType,
    project?: IProject,
    gpa?:string
    
}