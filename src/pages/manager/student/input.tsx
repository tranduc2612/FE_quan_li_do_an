import { useFormik } from "formik";
import { IPageProps } from "..";
import InputSelectCustom from "~/components/InputSelectCustom";
import { Button, FormHelperText, MenuItem, Modal, TextField } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { formatFullnameToUsername, roundedNumber } from "~/ultis/common";
import TimePickerCustom from "~/components/InputTimePicker";
import { addStudent, updateStudent } from "~/services/studentApi";
import { IStudent } from "~/types/IStudentType";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import dayjs from "dayjs";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import { getListSemester } from "~/services/semesterApi";
import { getListMajor } from "~/services/majorApi";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IClassificationType } from "~/types/IClassificationType";
import { getListClassification } from "~/services/classificationApi";
import LoadingData from "~/components/LoadingData";
import { toast } from "react-toastify";


const validationSchema = yup.object({
    fullname: yup
      .string()
      .required('Họ tên không được để trống'),
    //   .matches(/^'?\p{L}+(?:[' ]\p{L}+)*'?$/u,"Họ tên không được chứa kí tự đặc biệt"),
    semester: yup
      .string()
      .required('Học kỳ không được để trống'),
    status: yup
      .string()
      .required('Trạng thái không được để trống'),
    student_code: yup
        .string()
        .required('Mã sinh viên không được để trống'),
    class: yup
        .string()
        .required('Lớp không được để trống'),
    schoolYear: yup
        .string()
        .required('Khóa không được để trống'),
    phone: yup
        .string()
        .required('Số điện thoại không được để trống')
        .matches(/^[0-9]+$/, 'Số điện thoại không đúng định dạng'),    
    email: yup
        .string()
        .required('Email không được để trống')
        .email("Email không đúng định dạng"),
    address: yup
        .string()
        .required('Địa chỉ không được để trống'),
    gpa: yup
        .string()
        .required('Điểm GPA không được để trống')
        .matches(/^([0-3](\.\d{1,2})?|4(\.0{1,2})?|5(\.0{1,2})?)$/, 'Điểm GPA không hợp lệ'),  

  });

  type IProp = {
    setSwitchPageInput:(switchPage:boolean)=>void,
    switchPageInput:boolean,
    userSelect:IStudent,
    setUserSelect:(student:IStudent)=>void,
    hanleFetchApiListStudent:()=>void
  }


function RegisterStudent({setSwitchPageInput,switchPageInput,userSelect,setUserSelect,hanleFetchApiListStudent}:IProp) {
    const [dateOfBirth,setDateOfBirth] = useState<any>(dayjs(new Date()));
    const [loading,setLoading] = useState(true);
    const infoUser = useAppSelector(inforUser);
    const [semesterOption,setSemesterOption] = useState<ISemester[]>();
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [statusProjectOption,setStatusProjectOption] = useState<any[]>();
    const [initData,setInitData] = useState({
        username:"",
        fullname:"",
        student_code: "",
        status: "",
        semester: "",
        class: "",
        schoolYear:"",
        phone:"",
        email:"",
        address:"",
        gender: 0,
        gpa: "",
        statusProject:""
  })


    useEffect(()=>{
        Promise.all([getListSemester(
            {
                semesterId: "",
                nameSemester: ""
            }
        ),getListClassification({
            typeCode: "STATUS_SYSTEM"
        }),getListClassification({
            typeCode: "STATUS_PROJECT"
        })])
        .then((responses:IResponse<any>[]) => {
        
            const semesterRes = responses[0];
            const statusRes = responses[1];
            const statusProjectRes = responses[2];
            if(semesterRes.success && semesterRes.returnObj && semesterRes.returnObj.length > 0){
                setSemesterOption(semesterRes.returnObj);
                formik.values.semester = semesterRes ? semesterRes.returnObj[0].semesterId : ""
                // formik.setValues({
                //     ...formik.values,
                //     semester: semesterRes ? semesterRes.returnObj[0].semesterId : "",
                // });
            }
            if(statusRes.success && statusRes.returnObj && statusRes.returnObj.length > 0){
                setstatusOption(statusRes.returnObj)
                // formik.setValues({
                //     ...formik.values,
                //     status: !statusRes ? "" : statusRes.returnObj[0].code,
                //   });
                formik.values.status = statusRes ? statusRes.returnObj[0].code : "" 
            }

            if(statusProjectRes.success && statusProjectRes.returnObj && statusProjectRes.returnObj.length > 0){
                setStatusProjectOption(statusProjectRes.returnObj)
                // formik.setValues({
                //     ...formik.values,
                //     status: !statusProjectRes ? "" : statusProjectRes.returnObj[0].code,
                //   });
                // formik.values.statusProject = statusProjectRes ? statusProjectRes.returnObj[0].code : "" 
            }
            
            setLoading(false)
          })
        .then(()=>{
            if(userSelect.userName){
                console.log(userSelect)

                const student:IStudent = userSelect;
                formik.values.fullname = student.fullName || "";
                setDateOfBirth(dayjs(student.dob))
                formik.values.phone = student.phone || ""
                formik.values.email = student.email || ""
                formik.values.status = student.status || ""
                formik.values.student_code = student.studentCode || ""
                formik.values.address = student.address || ""
                formik.values.gpa = roundedNumber(student.gpa) || ""
                formik.values.class = student.className || ""
                formik.values.schoolYear = student.schoolYearName || ""
                formik.values.semester = student?.project?.semester?.semesterId || ""
                formik.values.statusProject = student?.project?.statusProject || "START"
                
            }
        })  
    },[]);

    

    const formik = useFormik({
        initialValues: initData,
        validationSchema: validationSchema,
        onSubmit: async (values,{ setSubmitting, setErrors, setStatus }) => {
            const date = dateOfBirth.$D < 10 ? "0"+dateOfBirth.$D.toString(): dateOfBirth.$D.toString();
            const month = dateOfBirth.$M+1 < 10 ? "0"+(dateOfBirth.$M+1).toString(): (dateOfBirth.$M+1).toString();

            const dataSubmit: IStudent = {
                passwordText: `${date}/${month}/${dateOfBirth.$y}`,
                fullName: values.fullname,
                dob: new Date(dateOfBirth.$y,dateOfBirth.$M,dateOfBirth.$D+1),
                phone: values.phone,
                email: values.email,
                createdAt: new Date(),
                createdBy: infoUser?.userName || "",
                status: values.status,
                statusProject: values.statusProject,
                studentCode: values.student_code,
                className: values.class,
                schoolYearName: values.schoolYear,
                semesterId: values.semester,
                address: values.address,
                gender: values.gender,
                gpa: values.gpa,
            }
            if(userSelect?.userName){
                const update = await updateStudent({
                    ...dataSubmit,
                    userName: userSelect.userName,
                    majorId: userSelect?.majorId
                });
                if(update.success){
                    setSwitchPageInput(false);
                    toast.success(update.msg)
                }else{
                    console.log(update)
                    setErrors({ username: update.msg})
                }
            }else{
                const data = await addStudent(dataSubmit);
                if(data.success){
                    setSwitchPageInput(false);
                    toast.success(data.msg)
                }else{
                    console.log(data)
                    setErrors({ username: data.msg})
                }
                console.log(data);
            }
            hanleFetchApiListStudent();
        },
    });

    const handleSubmit = ()=>{
        if(formik.errors){
            
        }
    }






    return ( <div>
        {
            loading ? <LoadingData /> : 
        <form action="" onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <InputSelectCustom
                                id={"semester"}
                                name={"semester"}
                                value={formik.values.semester} 
                                onChange={formik.handleChange}
                                placeholder="Học kỳ"
                                label="Học kỳ"
                                onBlur={undefined}
                                // readOnly={userSelect?.userName ? true : false}
                                isError={formik.touched.semester && Boolean(formik.errors.semester)}
                            >
                            {
                                semesterOption && semesterOption.map(x=>{
                                    return <MenuItem key={x.semesterId} value={x.semesterId}>{x.nameSemester}</MenuItem>
                                })
                            }
                                {/* <MenuItem value={"2_2025_2026"}>Học kỳ 2 năm 2025-2026</MenuItem> */}
                            </InputSelectCustom>
                            <span className="text-red-600">{formik.errors.semester}</span>
                        </div>

                        <div className="col-span-12">
                            <TextField 
                                id="username" 
                                label="Tài khoản"
                                value={formik.values.semester +"_"+ formik.values.student_code}
                                name="username"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                error={formik.touched.username && Boolean(formik.errors.username)} 
                                helperText={formik.touched.username && formik.errors.username} 
                                fullWidth 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"student_code"}
                                label="Mã sinh viên"
                                name={"student_code"}
                                readOnly={userSelect?.userName ? true : false}
                                disabled={userSelect?.userName ? true : false}
                                value={formik.values.student_code} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.student_code && Boolean(formik.errors.student_code)} 
                                errorMessage={formik.touched.student_code && formik.errors.student_code} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"fullname"}
                                label="Họ tên"
                                name={"fullname"}
                                value={formik.values.fullname} 
                                isError={formik.touched.fullname && Boolean(formik.errors.fullname)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.fullname && formik.errors.fullname} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"phone"}
                                label="Số điện thoại"
                                name={"phone"}
                                value={formik.values.phone} 
                                isError={formik.touched.phone && Boolean(formik.errors.phone)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.phone && formik.errors.phone} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"email"}
                                label="Email"
                                name={"email"}
                                value={formik.values.email} 
                                isError={formik.touched.email && Boolean(formik.errors.email)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.email && formik.errors.email} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"address"}
                                label="Địa chỉ"
                                name={"address"}
                                value={formik.values.address} 
                                isError={formik.touched.address && Boolean(formik.errors.address)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.address && formik.errors.address} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputSelectCustom
                                id={"gender"}
                                name={"gender"}
                                onChange={formik.handleChange}
                                value={formik.values.gender}
                                placeholder="Giới tính"
                                label="Giới tính"
                                onBlur={undefined}
                                isError={formik.touched.gender && Boolean(formik.errors.gender)}

                            >
                                <MenuItem value={0}>Nam</MenuItem>
                                <MenuItem value={1}>Nữ</MenuItem>
                            </InputSelectCustom>
                                <span className="text-red-600">{formik.errors.gender}</span>
                        </div>

                        <div className="col-span-12">
                            <TimePickerCustom label="Ngày tháng năm sinh"
                            // initialValue={new Date()} 
                                name={"DOB"}
                                type={"DatePicker"}
                                disableFuture={true}
                                maxDate={dayjs()}
                                onChange={(e) => {
                                    setDateOfBirth(e);
                                } } 
                                value={dateOfBirth}                                
                            />
                        </div>

                        {/* <div className="col-span-12">
                            <InputSelectCustom
                                id={"major"}
                                name={"major"}
                                onChange={formik.handleChange}
                                value={formik.values.major}
                                placeholder="Chuyên ngành"
                                label="Chuyên ngành"
                                onBlur={undefined}
                            >
                                <MenuItem value={"CNPM"}>Công nghệ phần mềm</MenuItem>
                                <MenuItem value={"TTNT"}>Trí tuệ nhân tạo</MenuItem>
                            </InputSelectCustom>
                        </div> */}

                        <div className="col-span-12">
                            <InputCustom
                                id={"schoolYear"}
                                label="Khóa"
                                name={"schoolYear"}
                                value={formik.values.schoolYear} 
                                isError={formik.touched.schoolYear && Boolean(formik.errors.schoolYear)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.schoolYear && formik.errors.schoolYear} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"class"}
                                label="Lớp"
                                name={"class"}
                                value={formik.values.class} 
                                isError={formik.touched.class && Boolean(formik.errors.class)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.class && formik.errors.class} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"gpa"}
                                label="Điểm GPA"
                                name={"gpa"}
                                value={formik.values.gpa} 
                                isError={formik.touched.gpa && Boolean(formik.errors.gpa)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.gpa && formik.errors.gpa} 
                            />
                        </div>
                        {
                            userSelect.userName &&
                            <div className="col-span-12">
                                <InputSelectCustom
                                    id={"statusProject"}
                                    name={"statusProject"}
                                    onChange={formik.handleChange}
                                    value={formik.values.statusProject}
                                    placeholder="Trạng thái đồ án"
                                    label="Trạng thái đồ án"
                                    onBlur={undefined}
                                    isError={formik.touched.statusProject && Boolean(formik.errors.statusProject)}

                                >
                                    {
                                        statusProjectOption && statusProjectOption.map((x)=>{
                                            return <MenuItem key={x.code} value={x.code}>{x.value}</MenuItem>
                                        })
                                    }

                                </InputSelectCustom>
                                    <span className="text-red-600">{formik.errors.statusProject}</span>
                            </div>
                        }

                        <div className="col-span-12">
                            <InputSelectCustom
                                id={"status"}
                                name={"status"}
                                onChange={formik.handleChange}
                                value={formik.values.status}
                                placeholder="Trạng thái"
                                label="Trạng thái"
                                onBlur={undefined}
                                isError={formik.touched.status && Boolean(formik.errors.status)}

                            >
                                {
                                    statusOption && statusOption.map((x)=>{
                                        return <MenuItem key={x.code} value={x.code}>{x.value}</MenuItem>
                                    })
                                }

                            </InputSelectCustom>
                                <span className="text-red-600">{formik.errors.status}</span>
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <div className="flex">
                            <div className="me-2">
                                <Button type="submit" variant="contained" startIcon={userSelect?.userName ? <CheckIcon /> : <AddIcon />}>
                                    
                                    {
                                        userSelect?.userName ? "Lưu" : "Tạo"
                                    }
                                </Button>
                            </div>
                            <div>
                                <Button variant="text" onClick={()=>{
                                    formik.resetForm(initData);
                                }}>
                                    <RefreshIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
        }
        
    </div> );
}

export default RegisterStudent;