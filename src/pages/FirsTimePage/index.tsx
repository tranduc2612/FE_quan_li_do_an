import { Button, MenuItem, Modal } from "@mui/material";
import { useFormik } from "formik";
import { ArrowLeft, ArrowRight } from "mdi-material-ui";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import images from "~/assets";
import InputCustom from "~/components/InputCustom";
import Loading from "~/components/Loading";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { changeInfo, errorLogging, inforUser, isError, isLogin, logging, login } from "~/redux/slices/authSlice";
import Slider from "react-slick";
import { formatDateTypeDateOnly } from "~/ultis/common";
import InputSelectCustom from "~/components/InputSelectCustom";
import { IMajorType } from "~/types/IMajorType";
import { getListMajor } from "~/services/majorApi";
import { IResponse } from "~/types/IResponse";
import { DataGrid, GridColDef, useGridApiRef, viVN } from "@mui/x-data-grid";
import { getListTeacher } from "~/services/teacherApi";
import { ITeacher } from "~/types/ITeacherType";
import { IStudent } from "~/types/IStudentType";
import { updateStudent } from "~/services/studentApi";
import { toast } from "react-toastify";

type IObjectField = {
    value: string
}

type IStateForm = {
    username: IObjectField,
    password: IObjectField
}

const validationSchema = yup.object({
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
  });

function FirstTimePage() {
    const uuid = useId();
    const [loadSubmit,setLoadSubmit] = useState(0);
    const isLoginUser = useAppSelector(isLogin);
    const errorLoginUser = useAppSelector(errorLogging);
    const currentUser = useAppSelector(inforUser);
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();
    const [paging,setPaging] = useState(0);
    const [openModal,setOpenModel] = useState(false)
    const apiRefTeacher = useGridApiRef();
    const [rowsTeacher,setRowsTeacher] = useState<any>([]);
    const navigate = useNavigate();
    
    const dispatch = useAppDispatch();
    let sliderRef = useRef<Slider | null>(null);
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };

    const columnsTeacher: GridColDef[] =[
        {
            field: 'id',
            headerName: 'STT',
            width: 80,
            maxWidth: 60,
            flex: 1,
            editable: true,
        },
        {
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 250,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            width: 200,
            editable: true,
        },
        {
            field: 'educationName',
            headerName: 'Học vị',
            width: 160,
            editable: true,
        },
        {
            field: 'major',
            headerName: 'Chuyên ngành',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.majorId  ? row?.major?.majorName : "Chưa đăng ký"}</>
            }
        },
    ]
    useEffect(()=>{
        formik.setErrors({[errorLoginUser.typeError]:errorLoginUser.messageError})
    },[loadSubmit,errorLoginUser])

    useEffect(()=>{
        if(sliderRef.current){
            setPaging(0)
            sliderRef.current.slickGoTo(0);
        }

        Promise.all([getListMajor({
            majorId:"",
            majorName:"",
        }),handleFetchApiTeacherList()])
        .then((responses:any) => {
        
            const majorState = responses[0];

            if(majorState.success && majorState.returnObj && majorState.returnObj.length > 0){
                setMajorOptions(majorState.returnObj)
            }
        })
    },[])
    const formik = useFormik({
        initialValues: {
            semesterId: currentUser?.project?.semester?.semesterId,
            username:currentUser?.userName,
            fullname:currentUser?.fullName,
            student_code: currentUser?.studentCode,
            dob: formatDateTypeDateOnly(currentUser?.dob),
            status: currentUser?.status,
            semester: currentUser?.semesterId,
            class: currentUser?.className,
            schoolYear:currentUser?.schoolYearName,
            phone:currentUser?.phone,
            email:currentUser?.email,
            address:currentUser?.address,
            gender: 0,
            major:currentUser?.major ? currentUser?.major?.majorId : "",
            gpa: currentUser?.gpa,
            registerMentor: currentUser?.userNameMentorRegister ? currentUser?.userNameMentorRegister : "",
            statusProject: currentUser?.project?.statusProject
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);

            const dataSubmit: IStudent = {
                userName: values.username,
                phone: values.phone,
                email: values.email,
                address: values.address,
                userNameMentorRegister: values.registerMentor,
                majorId:  values.major,
                isFirstTime: 0,
                statusProject: values.statusProject
            }
            console.log()
            const update = await updateStudent({
                ...dataSubmit
            });
            if(update.success){
                toast.success(update.msg)
                dispatch(changeInfo({
                    ...currentUser,
                    isFirstTime: 0,
                    phone: values.phone,
                    email: values.email,
                    address: values.address,
                    userNameMentorRegister: values.registerMentor,
                    statusProject: values.statusProject
                }));
                navigate("/profile/"+currentUser?.userName)
            }else{
                toast.error(update.msg);
            }
        },
    });

    const next = () => {
        if(sliderRef.current){
            setPaging(paging + 1)
            sliderRef.current.slickNext();
        }
      };
    const previous = () => {
        if(sliderRef.current){
            setPaging(paging - 1)
            sliderRef.current.slickPrev();
        }
    };

    const handleFetchApiTeacherList = async ()=>{
        await getListTeacher({
            pageSize: 0,
            pageIndex:  10
        })
        .then((res:IResponse<any>)=>{
          if(res.success && res.returnObj && res.returnObj.listResult) {
            const dataMap = res.returnObj.listResult;
            const newMap = dataMap.map((data:ITeacher,index:any)=>{
                return {
                    id: index+1,
                  ...data,
                  ...data?.education
                }
            }).filter((x:any)=>x.status !== "BLOCK")
            const totalItem = newMap.length;
            if(totalItem === 0){
                setRowsTeacher([])
            }else {
                setRowsTeacher([...newMap])
            } 
          }
        })
    }



    return (<div className={`w-screen h-screen relative flex flex-col justify-center items-center`}>
        <div className={`shadow-default rounded-md relative bg-white z-50 p-3 px-5 w-2/5 h-auto overflow-y-scroll overflow-x-hidden`}>
                <div className="flex justify-between">
                    <div>
                        {
                            paging != 0 &&
                            <span className="hover:bg-slate-200 rounded-full cursor-pointer p-2"  onClick={()=>{previous()}}>
                                <ArrowLeft />
                            </span>
                        }
                    </div>
                    
                    <div>
                        {
                            paging != 2 &&
                            <span className="hover:bg-slate-200 rounded-full cursor-pointer p-2" onClick={()=>{next()}}>
                                <ArrowRight />
                            </span>
                        }
                    </div>
                </div>

                <div className="title mt-5 mb-5 text-center text-2xl">
                    {/* <h2>Welcome to UTC! 👋🏻</h2> */}
                    <h1 className="font-bold">ĐĂNG KÝ THÔNG TIN ĐỒ ÁN</h1>
                </div>

                
                <form className="" onSubmit={formik.handleSubmit}>

                    <div className="slider-container">
                        <Slider ref={sliderRef} {...settings}>
                            {/* Form 1 */}
                            <div className="p-2">
                                <div className="mb-5">
                                    <InputCustom
                                        id={"semesterId"}
                                        label="Mã học kỳ"
                                        name={"semesterId"}
                                        value={formik.values.semesterId} 
                                        isError={formik.touched.semesterId && Boolean(formik.errors.semesterId)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.semesterId && formik.errors.semesterId}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-5">
                                    <InputCustom
                                        id={"username"}
                                        label="Tài khoản"
                                        name={"username"}
                                        value={formik.values.username} 
                                        isError={formik.touched.username && Boolean(formik.errors.username)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.username && formik.errors.username}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-5">
                                    <InputCustom
                                        id={"fullname"}
                                        label="Họ và tên"
                                        name={"fullname"}
                                        value={formik.values.fullname} 
                                        isError={formik.touched.fullname && Boolean(formik.errors.fullname)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.fullname && formik.errors.fullname}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-5">
                                    <InputCustom
                                        id={"student_code"}
                                        label="Mã sinh viên"
                                        name={"student_code"}
                                        value={formik.values.student_code} 
                                        isError={formik.touched.student_code && Boolean(formik.errors.student_code)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.student_code && formik.errors.student_code}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className="mb-5">
                                    <InputCustom
                                        id={"class"}
                                        label="Lớp"
                                        name={"class"}
                                        value={formik.values.class} 
                                        isError={formik.touched.class && Boolean(formik.errors.class)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.class && formik.errors.class}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="mb-5">
                                    <InputCustom
                                        id={"schoolYear"}
                                        label="Khóa"
                                        name={"schoolYear"}
                                        value={formik.values.schoolYear} 
                                        isError={formik.touched.schoolYear && Boolean(formik.errors.schoolYear)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.schoolYear && formik.errors.schoolYear}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                  
                            </div>
                            {/* Form 2 */}
                            <div className="p-2">
                                <div className="mb-5">
                                    <InputCustom
                                        id={"dob"}
                                        label="Ngày tháng năm sinh"
                                        name={"dob"}
                                        value={formik.values.dob || ""} 
                                        isError={formik.touched.dob && Boolean(formik.errors.dob)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.dob && formik.errors.dob}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className="mb-5">
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

                                <div className="mb-5">
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

                                <div className="mb-5">
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

                                <div className="mb-5">
                                    <InputSelectCustom
                                        id={"major"}
                                        name={"major"}
                                        onChange={formik.handleChange}
                                        value={formik.values.major}
                                        placeholder="Chuyên ngành"
                                        label="Chuyên ngành"
                                        onBlur={undefined}
                                    >
                                        <MenuItem value={""}>Tất cả</MenuItem>
                                        {
                                            majorOptions && majorOptions.map((x)=>{
                                                return <MenuItem key={x.majorId} value={x.majorId}>{x.majorName}</MenuItem>
                                            })
                                        }
                                    </InputSelectCustom>
                                </div>

                                <div className="mb-5">
                                    <InputCustom
                                        id={"gpa"}
                                        label="Điểm GPA"
                                        name={"gpa"}
                                        value={formik.values.gpa} 
                                        isError={formik.touched.gpa && Boolean(formik.errors.gpa)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.gpa && formik.errors.gpa}
                                        disabled
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Form 3*/}
                            <div className="p-2">
                                <div className="mb-5" onClick={()=>{
                                    setOpenModel(true)
                                }}>
                                    <InputCustom
                                        id={"registerMentor"}
                                        label="Đăng ký giảng viên hướng dẫn"
                                        name={"registerMentor"}
                                        value={formik.values.registerMentor} 
                                        isError={formik.touched.registerMentor && Boolean(formik.errors.registerMentor)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={formik.touched.registerMentor && formik.errors.registerMentor}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-5">
                                    <InputSelectCustom
                                        id={"statusProject"}
                                        name={"statusProject"}
                                        onChange={formik.handleChange}
                                        value={formik.values.statusProject}
                                        placeholder=""
                                        label="Bạn có bảo vệ đồ án không ?"
                                        onBlur={undefined}
                                    >
                                        <MenuItem value={"START"}>Có bảo vệ</MenuItem>
                                        <MenuItem value={"PAUSE"}>Chỉ thực tập</MenuItem>
                                    </InputSelectCustom>
                                </div>

                                <div className="float-end absolute right-0 bottom-0">
                                    <Button variant="contained" type="submit">Đăng ký</Button>
                               </div> 

                               
                            </div>
                        </Slider>
                    </div>
                </form>
        </div>

        <div className="w-full h-full z-10 absolute top-0">
            <img className="w-full h-full" src={images.background.background_default} />
        </div>

        <div className="w-full h-full bg-white absolute z-20 left-0 top-0 opacity-35">

        </div>

        <Modal
            open={openModal}
            onClose={()=>setOpenModel(false)}
            aria-labelledby="modal-modal-title-mentor-assign"
            aria-describedby="modal-modal-description-mentor-assign"
        >
            <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                Danh sách giảng viên
            </h2>

                <div className="mt-5">
                    <DataGrid
                        apiRef={apiRefTeacher}
                        rows={rowsTeacher}
                        columns={columnsTeacher}
                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        onCellDoubleClick={({row})=>{
                            setOpenModel(false)
                            formik.setValues({
                                ...formik.values,
                                registerMentor: row?.userName
                            })
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: { 
                                    page: 0, 
                                    pageSize: 5 
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                    />
                </div>

                <div className="mt-5 flex justify-end" >
                    <div className="mx-2">
                        <Button variant="outlined" onClick={()=>setOpenModel(false)}>Đóng</Button>
                    </div>

                    {/* <div>
                        <Button variant="contained" onClick={()=>{
                            console.log("Chon giảng viên này")
                        }}>Xác nhận chọn</Button>
                    </div> */}

                </div>
                
            </div>
        </Modal>

        

    </div>);
}

export default FirstTimePage;