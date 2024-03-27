import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, MenuItem, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import InputSelectCustom from "~/components/InputSelectCustom";
import TimePickerCustom from "~/components/InputTimePicker";
import LoadingData from "~/components/LoadingData";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { getListClassification } from "~/services/classificationApi";
import { getListMajor } from "~/services/majorApi";
import { addTeacher } from "~/services/teacherApi";
import { IClassificationType } from "~/types/IClassificationType";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";
import { ITeacher } from "~/types/ITeacherType";
import { formatFullnameToUsername } from "~/ultis/common";


const validationSchema = yup.object({
    fullname: yup
      .string()
      .required('Họ tên không được để trống')
      .matches(/^'?\p{L}+(?:[' ]\p{L}+)*'?$/u,"Họ tên không được chứa kí tự đặc biệt"),
    education: yup
      .string()
      .required('Học vấn không được để trống'),
    address: yup
      .string()
      .required('Địa chỉ không được để trống'),
    status: yup
      .string()
      .required('Trạng thái không được để trống'),
    major: yup
        .string()
        .required('Chuyên ngành không được để trống'),
    teacher_code: yup
        .string()
        .required('Mã giảng viên không được để trống'),
    phone: yup
        .string()
        .required('Số điện thoại không được để trống')
        .matches(/^[0-9]+$/, 'Số điện thoại không đúng định dạng'),    
    email: yup
        .string()
        .required('Email không được để trống')
        .email("Email không đúng định dạng"),

  });



function RegisterTeacher({setSwitchPageInput,switchPageInput,userName}:any) {
    const [dateOfBirth,setDateOfBirth] = useState<any>(dayjs(new Date()));
    const [loading,setLoading] = useState(true);
    const infoUser = useAppSelector(inforUser);
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();

    const [initData,setInitData] = useState()


    useEffect(()=>{
        Promise.all([getListClassification({
            typeCode: "STATUS_SYSTEM"
        }),
        getListMajor({
            majorId:"",
            majorName:""
        })])
        .then((responses:IResponse<any>[]) => {
        
            const statusRes = responses[0];
            const majorState:IResponse<IMajorType[]> = responses[1];

            if(statusRes.success && statusRes.returnObj && statusRes.returnObj.length > 0){
                setstatusOption(statusRes.returnObj)
                formik.values.status = statusRes ? statusRes.returnObj[0].code : "" 
            }
            if(majorState.success && majorState.returnObj && majorState.returnObj.length > 0){
                setMajorOptions(majorState.returnObj)
                formik.values.major = majorState ? majorState.returnObj[0].majorId : "" 
            }

            formik.values.isAdmin = "0" 
            
            setLoading(false)
          })  
    },[]);

    const formik = useFormik({
        initialValues: {
            username:"",
            fullname:"",
            teacher_code: "",
            status: "",
            phone:"",
            email:"",
            education: "",
            major:"",
            isAdmin:"",
            address:"",
            gender:0
      },
        validationSchema: validationSchema,
        onSubmit: async (values,{ setSubmitting, setErrors, setStatus }) => {
            const dataSubmit: ITeacher = {
                passwordText: `${dateOfBirth.$D}/${dateOfBirth.$M+1}/${dateOfBirth.$y}`,
                fullName: values.fullname,
                dob: new Date(dateOfBirth.$y,dateOfBirth.$M,dateOfBirth.$D+1),
                phone: values.phone,
                email: values.email,
                avatar: "",
                createdAt: new Date(),
                createdBy: infoUser?.userName || "",
                status: values.status,
                teacherCode: values.teacher_code,
                isAdmin: values.isAdmin,
                address: values.address,
                gender: values.gender
            }
            const data = await addTeacher(dataSubmit);
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
                            <TextField 
                                id="username" 
                                label="Tài khoản"
                                value={formatFullnameToUsername(formik.values.fullname) +"_"+ formik.values.teacher_code}
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
                                id={"teacher_code"}
                                label="Mã giảng viên"
                                name={"teacher_code"}
                                value={formik.values.teacher_code} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.teacher_code && Boolean(formik.errors.teacher_code)} 
                                errorMessage={formik.touched.teacher_code && formik.errors.teacher_code} 
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
                                value={dateOfBirth} 
                                name={"DOB"} 
                                type={"DatePicker"}
                                disableFuture={true}
                                maxDate={dayjs()} 
                                onChange={(e)=>{
                                    setDateOfBirth(e);
                                }} 
                                />
                        </div>

                        <div className="col-span-12">
                            <InputSelectCustom
                                id={"major"}
                                name={"major"}
                                onChange={formik.handleChange}
                                value={formik.values.major}
                                placeholder="Chuyên ngành"
                                label="Chuyên ngành"
                                onBlur={undefined}
                            >
                                    {
                                        majorOptions && majorOptions.map((x)=>{
                                            return <MenuItem key={x.majorId} value={x.majorId}>{x.majorName}</MenuItem>
                                        })
                                    }
                            </InputSelectCustom>
                        </div>

                        <div className="col-span-12">
                            <InputSelectCustom
                                id={"isAdmin"}
                                name={"isAdmin"}
                                onChange={formik.handleChange}
                                value={formik.values.isAdmin}
                                placeholder="Quyền"
                                label="Quyền"
                                onBlur={undefined}
                            >
                                <MenuItem value={"0"}>Giảng viên</MenuItem>
                                <MenuItem value={"1"}>Quản trị viên</MenuItem>
                            </InputSelectCustom>
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"education"}
                                label="Học vấn"
                                name={"education"}
                                value={formik.values.education} 
                                isError={formik.touched.education && Boolean(formik.errors.education)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.education && formik.errors.education} 
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

export default RegisterTeacher;