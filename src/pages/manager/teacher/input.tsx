import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, MenuItem } from "@mui/material";
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
import { addTeacher, updateTeacher } from "~/services/teacherApi";
import { IClassificationType } from "~/types/IClassificationType";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";
import { ITeacher } from "~/types/ITeacherType";


const validationSchema = yup.object({
    username: yup
      .string()
      .required('Tên đăng nhập không được để trống'),
    fullname: yup
      .string()
      .required('Họ tên không được để trống'),
    //   .matches(/^'?\p{L}+(?:[' ]\p{L}+)*'?$/u,"Họ tên không được chứa kí tự đặc biệt"),
    education: yup
      .string()
      .required('Học vị không được để trống'),
    address: yup
      .string()
      .required('Địa chỉ không được để trống'),
    status: yup
      .string()
      .required('Trạng thái không được để trống'),
    major: yup
        .string()
        .required('Chuyên ngành không được để trống'),
    phone: yup
        .string()
        .required('Số điện thoại không được để trống')
        .matches(/^[0-9]+$/, 'Số điện thoại không đúng định dạng'),    
    email: yup
        .string()
        .required('Email không được để trống')
        .email("Email không đúng định dạng"),

  });



function RegisterTeacher({setSwitchPageInput,switchPageInput,userSelect,handleFetchApi}:any) {
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
          .then(()=>{
            if(userSelect.userName){
                console.log(userSelect)
                const teacher:ITeacher = userSelect;
                formik.values.username = teacher.userName || ""
                formik.values.fullname = teacher.fullName || "";
                setDateOfBirth(dayjs(teacher.dob))
                formik.values.phone = teacher.phone || ""
                formik.values.email = teacher.email || ""
                formik.values.status = teacher.status || ""
                formik.values.address = teacher.address || ""
                formik.values.education = teacher.education || ""
                formik.values.isAdmin = teacher.isAdmin || "0"
            }
        })  
    },[]);

    const formik = useFormik({
        initialValues: {
            username:"",
            fullname:"",
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
            const date = dateOfBirth.$D < 10 ? "0"+dateOfBirth.$D.toString(): dateOfBirth.$D.toString();
            const month = dateOfBirth.$M+1 < 10 ? "0"+(dateOfBirth.$M+1).toString(): (dateOfBirth.$M+1).toString();

            const dataSubmit: ITeacher = {
                userName: values.username,
                passwordText: `${date}/${month}/${dateOfBirth.$y}`,
                fullName: values.fullname,
                dob: new Date(dateOfBirth.$y,dateOfBirth.$M,dateOfBirth.$D+1),
                phone: values.phone,
                email: values.email,
                avatar: "",
                createdAt: new Date(),
                createdBy: infoUser?.userName || "",
                status: values.status,
                isAdmin: values.isAdmin,
                address: values.address,
                gender: values.gender,
                education: values.education,
                majorId: values.major
            }
            console.log(dataSubmit)
            if(userSelect.userName){
                const data = await updateTeacher(dataSubmit);
                if(data.success){
                    setSwitchPageInput(false);
                    handleFetchApi();
                    toast.success(data.msg)
                }else{
                    console.log(data)
                    setErrors({ username: data.msg})
                }
            }else{
                const data = await addTeacher(dataSubmit);
                if(data.success){
                    setSwitchPageInput(false);
                    handleFetchApi();
                    toast.success(data.msg)
                }else{
                    console.log(data)
                    setErrors({ username: data.msg})
                }
            }
        },
    });






    return ( <div>
        {
            loading ? <LoadingData /> : 
        <form action="" onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <InputCustom
                                id={"username"}
                                label="Tên đăng nhập"
                                name={"username"}
                                value={formik.values.username} 
                                readOnly={userSelect?.userName ? true : false}
                                disabled={userSelect?.userName ? true : false}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.username && Boolean(formik.errors.username)} 
                                errorMessage={formik.touched.username && formik.errors.username} 
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
                                label="Học vị"
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