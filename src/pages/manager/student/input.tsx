import { useFormik } from "formik";
import { IPageProps } from "..";
import InputSelectCustom from "~/components/InputSelectCustom";
import { Button, FormHelperText, MenuItem, TextField } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect, useState } from "react";
import { formatFullnameToUsername } from "~/ultis/common";
import TimePickerCustom from "~/components/InputTimePicker";
import { addStudent } from "~/services/studentApi";
import { IStudent } from "~/types/IStudentType";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import dayjs from "dayjs";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import { getListSemester } from "~/services/semester";
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
      .required('Họ tên không được để trống')
      .matches(/^'?\p{L}+(?:[' ]\p{L}+)*'?$/u,"Họ tên không được chứa kí tự đặc biệt"),
    semester: yup
      .string()
      .required('Học kỳ không được để trống'),
    status: yup
      .string()
      .required('Trạng thái không được để trống'),
    major: yup
        .string(),
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

  });



function RegisterStudent({setSwitchPageInput,switchPageInput}:any) {
    const [dateOfBirth,setDateOfBirth] = useState<any>(dayjs(new Date()));
    const [loading,setLoading] = useState(true);
    const infoUser = useAppSelector(inforUser);
    const [semesterOption,setSemesterOption] = useState<ISemester[]>();
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [initData,setInitData] = useState({
        username:"",
        fullname:"",
        student_code: "",
        status: "",
        semester: "",
        class: "",
        schoolYear:"",
        phone:"",
        email:""
  })


    useEffect(()=>{
        Promise.all([getListSemester(
            {
                semesterId: "",
                nameSemester: ""
            }
        ),getListClassification({
            typeCode: "STATUS_SYSTEM"
        })])
        .then((responses:IResponse<any>[]) => {
        
            const semesterRes = responses[0];
            const statusRes = responses[1];
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
            
            setLoading(false)
          })
    },[]);

    const formik = useFormik({
        initialValues: initData,
        validationSchema: validationSchema,
        onSubmit: async (values,{ setSubmitting, setErrors, setStatus }) => {
            const dataSubmit: IStudent = {
                passwordText: `${dateOfBirth.$D}/${dateOfBirth.$M+1}/${dateOfBirth.$y}`,
                fullName: values.fullname,
                dob: new Date(dateOfBirth.$y,dateOfBirth.$M,dateOfBirth.$D+1),
                phone: values.phone,
                email: values.email,
                avatar: "",
                createdAt: new Date(),
                createdBy: infoUser?.userName || "",
                status: values.status,
                studentCode: values.student_code,
                className: values.class,
                schoolYearName: values.schoolYear,
                semesterId: values.semester
            }
            const data = await addStudent(dataSubmit);
            if(data.success){
                setSwitchPageInput(false);
                toast.success(data.msg)
            }else{
                console.log(data)
                setErrors({ username: data.msg})
            }
            console.log(data);
        },
    });






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
                                value={formik.values.semester +"_"+ formatFullnameToUsername(formik.values.fullname) +"_"+ formik.values.student_code}
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
                            <TimePickerCustom label="Ngày tháng năm sinh" 
                                initialValue={new Date()} 
                                name={"DOB"} 
                                type={"DatePicker"}
                                disableFuture={true}
                                maxDate={dayjs()} 
                                onChange={(e)=>{
                                    setDateOfBirth(e);
                                }} 
                                />
                        </div>

                        {/* <div className="col-span-12">
                            <InputSelectCustom
                                id={"major"}
                                name={"major"}
                                onChange={formik.handleChange}
                                value={formik.values.major}
                                placeholder="Chuyên nghành"
                                label="Chuyên nghành"
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
                                <Button type="submit" variant="contained" startIcon={<CheckIcon />}>
                                    Lưu
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