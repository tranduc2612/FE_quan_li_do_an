import { Avatar, Button, styled } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { useFormik } from 'formik';
import { ChevronLeft, Pencil } from "mdi-material-ui";
import { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from 'yup';
import images from "~/assets";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import InputCustom from "~/components/InputCustom";
import InputSelectCustom from "~/components/InputSelectCustom";
import Loading from "~/components/Loading";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { changeInfo, inforUser } from "~/redux/slices/authSlice";
import { getListMajor } from "~/services/majorApi";
import { updateStudent } from "~/services/studentApi";
import { updateTeacher } from "~/services/teacherApi";
import { GetProfileUser, changeAvatar, getFileAvatar } from "~/services/userApi";
import { IMajorType } from "~/types/IMajorType";
import { IProjecType } from "~/types/IProjectType";
import { IResponse } from "~/types/IResponse";
import { IStudent } from "~/types/IStudentType";
import { ITeacher } from "~/types/ITeacherType";
import { IUser } from "~/types/IUser";
import { validateFileType } from "~/ultis/common";

interface MyFormValues {
    fullname: string,
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Email không đúng định dạng")
      .required('Email không được để trống'),
    address: yup
      .string()
      .required('Địa chỉ không được để trống'),
    phone: yup
        .string()
        .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không đúng định dạng')
        .required('Điện thoại không được để trống'),
  });
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function ProfileInput() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [loading,setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const [profile,setProfile] = useState<IUser>();
    const [project,setProject] = useState<IProjecType>();
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();
    const infoUser = useAppSelector(inforUser);
    const inputRef = useRef<any>();
    const [avatar,setAvatar] = useState<any>();
    const [statusProjectValue,setStatusProjectValue] = useState("")

    const formik = useFormik({
        initialValues: {
          fullname: "",
          student_code:"",
          email:"",
          phone:"",
          major:"",
          class_name:"",
          school_year:"",
          address:"",
          userName:"",
          avatar: "",
          registerMentor: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if(infoUser?.userName === profile?.userName){

                if(infoUser?.role === profile?.role && profile?.role === "STUDENT"){
                    // update student
                    const dataSubmit: IStudent = {
                        userName: profile?.userName,
                        phone: formik.values.phone,
                        email: formik.values.email,
                        avatar: formik.values.avatar,
                        address: formik.values.address,
                        majorId: formik.values.major
                    }
                    const update = await updateStudent(dataSubmit);
                    if(update.success){
                        toast.success(update.msg)
                        navigate("/profile/"+profile?.userName)
                    }else{
                        toast.error(update.msg)
                        console.log(update)
                    }
                }
                if(profile?.role === "TEACHER" || profile?.role === "ADMIN"){
    
                    const dataSubmit: ITeacher = {
                        userName: profile?.userName,
                        phone: formik.values.phone,
                        email: formik.values.email,
                        avatar: formik.values.avatar,
                        address: formik.values.address,
                    }
                    const data = await updateTeacher(dataSubmit);
                    if(data.success){
                        toast.success(data.msg)
                        navigate("/profile/"+profile?.userName)
                    }else{
                        toast.error(data.msg)
                        console.log(data)
                    }
                }
            }
        },
    });

    useEffect(()=>{
        setLoading(true);
        Promise.all([getListMajor({
            majorId:"",
            majorName:""
        })])
        .then((responses:IResponse<any>[]) => {
            const majorState = responses[0]

            if(majorState.success && majorState.returnObj && majorState.returnObj.length > 0){
                setMajorOptions(majorState.returnObj)
            }
            setLoading(false)
        })

        fetchApiAvatar();
    },[]);

    const fetchApiAvatar = ()=>{
        getFileAvatar(infoUser?.role,infoUser?.userName)
        .then((response:any)=>{
            const blob = response.data;
            const imgUrl = URL.createObjectURL(blob);
            setAvatar(imgUrl);
        })
    }

    useEffect(()=>{
        setLoading(true)
        if(infoUser?.userName !== id){
            navigate("/not-found")
        }
        if(id){
            GetProfileUser(id)
            .then((res:IResponse<IUser>)=>{
                console.log(res);
                if(res.success && res.returnObj){
                    const req = res.returnObj
                    if(req?.project){
                        setProject(req.project)
                        formik.setValues({
                            userName: req?.userName || "",
                            fullname: req.project?.userNameNavigation?.fullName || "",
                            student_code: req.project?.userNameNavigation?.studentCode || "",
                            email: req.project?.userNameNavigation?.email || "",
                            phone: req.project?.userNameNavigation?.phone || "",
                            major: req.project?.userNameNavigation?.majorId || "",
                            class_name: req.project?.userNameNavigation?.className || "",
                            school_year: req.project?.userNameNavigation?.schoolYearName || "",
                            address: req.project?.userNameNavigation?.address || "",
                            avatar: req.project?.userNameNavigation?.avatar || "",
                            registerMentor: req?.userNameMentorRegister || ""
                        })
                    }
                    if(req?.role === "TEACHER" || req?.role === "ADMIN"){
                        console.log(req)
                        formik.setValues({
                            userName: req?.userName || "",
                            fullname: req.fullName || "",
                            student_code: req.studentCode || "",
                            email: req.email || "",
                            phone: req?.phone || "",
                            major: req.major?.majorId || "",
                            class_name: req.className || "",
                            school_year: req.schoolYearName || "",
                            address: req.address || "",
                            avatar: req.project?.userNameNavigation?.avatar || "",
                            registerMentor: req?.userNameMentorRegister || ""
                        })
                    }
                    setProfile(req)
                    setLoading(false)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    },[id])


    return ( <>
        {
            loading ? <Loading /> : <>
                {
                    infoUser?.userName === id &&
                    <>
                        <HeaderPageTitle pageName="Trang cá nhân" pageChild="Chỉnh sửa" />
                        <BoxWrapper className={" mb-5"}>
                            <>
                                <div className="mb-5">
                                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                            Quay lại
                                    </Button>
                                </div>
                                <form onSubmit={formik.handleSubmit}>
                                        <div>
                                            <div className="mb-8">
                                                <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                                                    Thông tin tài khoản
                                                </h2>
                                                <div className="flex justify-center mb-8">
                                                    <div className="relative cursor-pointer">
                                                        <Avatar 
                                                            alt="Remy Sharp" 
                                                            src={avatar}  
                                                            sx={{ width: 150, height: 150 }}>
                                                                
                                                        </Avatar>
                                                        <div className="absolute bg-slate-600 opacity-0 top-0 left-0 w-full h-full rounded-full hover:opacity-30 ease-linear" onClick={()=>{
                                                            if (inputRef.current) {
                                                                inputRef.current.click();
                                                            }
                                                        }}>
                                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                                <Pencil className="text-white"/>
                                                            </div>
                                                            <input ref={inputRef} type="file" accept=".jpg, .jpeg, .png, .gif" style={{ display: 'none' }} 
                                                                onChange={(event:any)=>{

                                                                    const file = event.target.files[0];
                                                                    
                                                                    // Kiểm tra nếu không phải là tệp ảnh
                                                                    if (!validateFileType(file?.type)) {
                                                                        toast.warn("Định dạng ảnh không hợp lệ !")
                                                                        return;
                                                                    }
                                                                    console.log(file)
                                                                    const form = new FormData();
                                                                    form.append('file', file);
                                                                    form.append('username', infoUser?.userName || "");
                                                                    form.append('role', infoUser?.role || "");

                                                                    changeAvatar(form)
                                                                    .then((res:any)=>{
                                                                        const data = res?.data;
                                                                        if(data.success){
                                                                            const dataUser: IUser = {
                                                                                ...infoUser,
                                                                                avatar: Math.random().toString()
                                                                              };
                                                                            dispatch(changeInfo(dataUser));
                                                                            fetchApiAvatar();
                                                                            toast.success("Thay đổi ảnh đại diện thành công !")
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        

                                                    </div>
                                                </div>
        
                                                <div className={"grid grid-cols-9"}>
                                                    {
                                                        profile?.role === "TEACHER" || profile?.role === "ADMIN" && 
                                                        <div className={"col-span-3 m-2"}>
                                                        <InputCustom
                                                            id="userName" 
                                                            label={"Tên tài khoản"} 
                                                            name={"userName"}
                                                            disabled={true}
                                                            value={formik.values.userName} 
                                                            isError={formik.touched.userName && Boolean(formik.errors.userName)} 
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            errorMessage={formik.touched.userName && formik.errors.userName} 
                                                        />
                                                    </div>
                                                    }
                                                    <div className={"col-span-3 m-2"}>
                                                        <InputCustom
                                                            id="fullname" 
                                                            label={"Họ và tên"} 
                                                            name={"fullname"}
                                                            disabled={true}
                                                            value={formik.values.fullname} 
                                                            isError={formik.touched.fullname && Boolean(formik.errors.fullname)} 
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            errorMessage={formik.touched.fullname && formik.errors.fullname} 
                                                        />
                                                    </div>
        
                                                    <div className={"col-span-3 m-2"}>
                                                        <InputCustom
                                                            id="email" 
                                                            label={"Email"} 
                                                            name={"email"}
                                                            value={formik.values.email} 
                                                            isError={formik.touched.email && Boolean(formik.errors.email)} 
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            errorMessage={formik.touched.email && formik.errors.email} 
                                                        />
                                                    </div>
        
                                                    <div className={"col-span-3 m-2"}>
                                                        <InputCustom
                                                            id="phone" 
                                                            label={"Số điện thoại"} 
                                                            name={"phone"}
                                                            value={formik.values.phone} 
                                                            isError={formik.touched.phone && Boolean(formik.errors.phone)} 
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            errorMessage={formik.touched.phone && formik.errors.phone} 
                                                        />
                                                    </div>

                                                    <div className={"col-span-3 m-2"}>
                                                        <InputCustom
                                                            id="address" 
                                                            label={"địa chỉ"} 
                                                            name={"address"}
                                                            value={formik.values.address} 
                                                            isError={formik.touched.address && Boolean(formik.errors.address)} 
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            errorMessage={formik.touched.address && formik.errors.address} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                profile?.role === "STUDENT" ? 
                                                <div className="relative mb-8">
                                                    <h2 className={"font-bold text-primary-blue text-xl"}>
                                                        Thông tin sinh viên
                                                    </h2>

                                                    
            
                                                    <div className={"grid grid-cols-9 mt-2"}>
                                                        <div className={"col-span-3 m-2"}>
                                                            <InputCustom
                                                                id="school_year" 
                                                                label={"Khóa"} 
                                                                name={"school_year"}
                                                                disabled={true}
                                                                value={formik.values.school_year} 
                                                                isError={formik.touched.school_year && Boolean(formik.errors.school_year)} 
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                errorMessage={formik.touched.school_year && formik.errors.school_year} 
                                                            />
                                                        </div>

                                                        <div className={"col-span-3 m-2"}>
                                                            <InputCustom
                                                                id="student_code" 
                                                                label={"Mã sinh viên"} 
                                                                name={"student_code"}
                                                                disabled={true}
                                                                value={formik.values.student_code} 
                                                                isError={formik.touched.student_code && Boolean(formik.errors.student_code)} 
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                errorMessage={formik.touched.student_code && formik.errors.student_code} 
                                                            />
                                                        </div>

                                                        <div className={"col-span-3 m-2"}>
                                                            <InputCustom
                                                                id="class_name" 
                                                                label={"Lớp"} 
                                                                name={"class_name"}
                                                                disabled={true}
                                                                value={formik.values.class_name} 
                                                                isError={formik.touched.class_name && Boolean(formik.errors.class_name)} 
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                errorMessage={formik.touched.class_name && formik.errors.class_name} 
                                                            />
                                                        </div>
                                                        <div className={"col-span-3 m-2"}>
                                                            <InputSelectCustom
                                                            id={"major"}
                                                            name={"major"}
                                                            onChange={formik.handleChange}
                                                            value={formik.values.major}
                                                            placeholder="Chuyên ngành"
                                                            label="Chuyên ngành"
                                                            onBlur={undefined}
                                                            disabled
                                                            >
                                                                <MenuItem value={""}>Tất cả</MenuItem>
                                                                {
                                                                    majorOptions && majorOptions.map((x)=>{
                                                                        return <MenuItem key={x.majorId} value={x.majorId}>{x.majorName}</MenuItem>
                                                                    })
                                                                }
                                                            </InputSelectCustom>
                                                        </div>

                                                        

                                                        <div className={"col-span-3 m-2"}>
                                                            <InputCustom
                                                                id="registerMentor" 
                                                                label={"Mã giảng viên đăng ký"} 
                                                                name={"registerMentor"}
                                                                disabled={true}
                                                                value={formik.values.registerMentor} 
                                                                isError={formik.touched.registerMentor && Boolean(formik.errors.registerMentor)} 
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                errorMessage={formik.touched.registerMentor && formik.errors.registerMentor} 
                                                            />
                                                        </div>
            
                                                    </div>
                                                </div>
                                                :
                                                <div className="relative mb-8">
                                                    <h2 className={"font-bold text-primary-blue text-xl"}>
                                                        Thông tin giảng viên
                                                    </h2>

                                                    
            
                                                    <div className={"grid grid-cols-9 mt-2"}>
                                                        <div className={"col-span-3 m-2"}>
                                                            <InputSelectCustom
                                                            id={"major"}
                                                            name={"major"}
                                                            readOnly={true}
                                                            onChange={formik.handleChange}
                                                            value={formik.values.major}
                                                            placeholder="Chuyên ngành"
                                                            label="Chuyên ngành"
                                                            onBlur={undefined}
                                                            disabled={true}
                                                            >
                                                                <MenuItem value={""}>Tất cả</MenuItem>
                                                                {
                                                                    majorOptions && majorOptions.map((x)=>{
                                                                        return <MenuItem key={x.majorId} value={x.majorId}>{x.majorName}</MenuItem>
                                                                    })
                                                                }
                                                            </InputSelectCustom>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div className="flex justify-end px-2">
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    tabIndex={-1}
                                                    startIcon={<Pencil />}
                                                    >
                                                        Cập nhật
                                                </Button>
                                            </div>
                                        </div>
                                </form>
                            </>
                        </BoxWrapper>
                    
                    </>
                }
            
            </>
        }
    </> );
}

export default ProfileInput;