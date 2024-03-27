import { useAppDispatch, useAppSelector } from "~/redux/hook";
import classNames from "classnames/bind";
import style from "./profile.module.scss"
import { useNavigate, useParams } from "react-router-dom";
import AccordionCustom from "~/components/AccordionCustom";
import InputCustom from "~/components/InputCustom";
import { useEffect, useState } from "react";
import ButtonCustom from "~/components/ButtonCustom";
import BoxWrapper from "~/components/BoxWrap";
import { Popper,Box, TextField, OutlinedInput, Button } from "@mui/material";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import { Pencil, TrashCanOutline } from "mdi-material-ui";
import ModalCustom from "~/components/Modal";
import { useFormik } from "formik";
import * as yup from 'yup';
import { GetProfileUser } from "~/services/userApi";
import { IUser } from "~/types/IUser";
import { IResponse } from "~/types/IResponse";
import Loading from "~/components/Loading";
import { dateShowNotification, formatDateTypeDateOnly, isCurrentTimeInRange, renderGender, renderRole } from "~/ultis/common";
import images from "~/assets";
import { inforUser } from "~/redux/slices/authSlice";
import { IScheduleWeek } from "~/types/IScheduleWeek";
import { getListScheduleWeek } from "~/services/scheduleWeekApi";
import ScheduleItem from "~/components/BoxItemPlant";

const keyPost = '/api/user/123';
const cx = classNames.bind(style);

const validationSchema = yup.object({
    password: yup
      .string()
      .required('Mật khẩu không được để trống'),
    new_password: yup
      .string()
      .required('Mật khẩu không được để trống'),
    new_password_2: yup
      .string()
      .required('Mật khẩu không được để trống')
      .oneOf([yup.ref('new_password')], 'Mật khẩu không khớp'),
  });

function Profile() {
    // const [showAccountModal,setShowAccountModal] = useState(false);
    // const [showRoleModal,setRoleModal] = useState(false);
    const [loading,setLoading] = useState(false);
    const [profile,setProfile] = useState<IUser>();
    const info = useAppSelector(inforUser)
    const [scheduleNow,setScheduleNow] = useState<IScheduleWeek[]>([])
    const [schedulePast,setSchedulePast] = useState<IScheduleWeek[]>([])
    const [scheduleFuture,setScheduleFuture] = useState<IScheduleWeek[]>([])
    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
          password: "",
          new_password:"",
          new_password_2:""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          console.log(values);
        },
      });

    useEffect(()=>{
        setLoading(true)
        if(id){
            GetProfileUser(id)
            .then((res:IResponse<IUser>)=>{
                console.log(res);
                if(res.success && res.returnObj){
                    setProfile(res.returnObj)
                    setLoading(false)

                    
                }
            })
            .catch((err)=>{
                console.log(err)
            })

            
        }
    },[id])
    
    useEffect(()=>{
        if(info?.role === "TEACHER" && profile?.project?.userNameMentorNavigation?.userName === info?.userName){
            handleFetchApiData()
        }
    },[profile])


    const handleFetchApiData = ()=>{
        const teacherMentor = profile?.project?.userNameMentorNavigation;
        const semesterId = profile?.project?.semesterId;
        if(teacherMentor && semesterId){
            getListScheduleWeek(semesterId,teacherMentor?.userName)
            .then((res:IResponse<IScheduleWeek[]>)=>{
                console.log(res)
                        const lstPast: IScheduleWeek[] = [];
                        const lstNow: IScheduleWeek[] = [];
                        const lstFur: IScheduleWeek[] = [];
                        if(res.success && res.returnObj && res.returnObj.length > 0){
                            const lstSchedule = res.returnObj;
                            lstSchedule.map((item:IScheduleWeek)=>{
                                if(item?.fromDate && item?.toDate){
                                    const fromDate = new Date(item?.fromDate);
                                    const toDate = new Date(item?.toDate);
                                    const check = isCurrentTimeInRange(fromDate,toDate)
                                    if(check === -1) {
                                        lstPast.push(item)
                                    }
                                    if(check === 0){
                                        lstNow.push(item)
                                    }
                                    if(check === 1){
                                        lstFur.push(item)
                                    }
                                }
                            })
                        }
                        setSchedulePast(lstPast);
                        setScheduleNow(lstNow)
                        setScheduleFuture(lstFur)
            })
        }
    }

      


    return (<>
        <HeaderPageTitle pageName="Trang cá nhân" />
        {
            loading ? <Loading /> : 
        <>
            <BoxWrapper className={" mb-5"}>
                <div>
                    <div className="relative mb-8">
                        <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                            Thông tin tài khoản
                        </h2>
                        {
                            info?.userName === profile?.userName &&
                            <div className="absolute right-0 top-0 flex tools">
                                <div className="flex items-center cursor-pointer p-2 rounded-full text-3xl me-2 hover:bg-gray-200"
                                    onClick={()=>{
                                        navigate("/profile/input/ductm")
                                        // setShowAccountModal(true);
                                    }}
                                >
                                    <Pencil className="text-primary-blue" />
                                </div>
                            </div>
                        }

                        <div className={"grid grid-cols-9"}>
                            <div className={"col-span-3 m-2"}>
                                <b>Họ và tên:</b> <span className={"text-text-color"}>{profile?.fullName}</span> 
                            </div>

                            <div className={"col-span-3 m-2"}>
                                <b>Ngày sinh:</b> {profile?.dob ? <span className={"text-text-color"}>{formatDateTypeDateOnly(new Date(profile?.dob || ""))}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}
                            </div>

                            <div className={"col-span-3 m-2"}>
                                <b>Giới tính:</b> {renderGender(profile?.gender)}
                            </div>

                            <div className={"col-span-3 m-2"}>
                                <b>Email:</b> {profile?.email ? <span className={"text-text-color"}>{profile?.email}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}   
                            </div>

                            <div className={"col-span-3 m-2"}>
                                <b>Số điện thoại:</b> {profile?.phone ? <span className={"text-text-color"}>{profile?.phone}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}   
                            </div>

                            <div className={"col-span-3 m-2"}>
                                <b>Vai trò:</b> <span className={"text-text-color"}>
                                    {renderRole(profile?.role || "")}    
                                </span> 
                            </div>

                            <div className={"col-span-3 m-2"}>
                                <b>Trạng thái tài khoản:</b> Chưa có  
                            </div>
                        </div>
                    </div>
                    
                    {
                        profile?.role === "STUDENT" &&
                        <>
                            <div className="relative">
                                <h2 className={"font-bold text-primary-blue text-xl"}>
                                    Thông tin sinh viên
                                </h2>

                                <div className={"grid grid-cols-9 mt-2"}>
                                    <div className={"col-span-3 m-2"}>
                                        <b>Mã sinh viên:</b> <span className={"text-text-color"}>{profile?.studentCode}</span>
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <b>Lớp:</b> <span className={"text-text-color"}>{profile?.className}</span>
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <b>Khóa:</b> <span className={"text-text-color"}>{profile?.schoolYearName}</span>
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <b>Mã học kỳ:</b> <span className={"text-text-color"}>{profile?.project?.semester?.semesterId}</span>
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <b>Chuyên ngành:</b> {profile?.major ? <span className={"text-text-color"}>{profile?.major.majorName}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                {
                    profile?.role === "TEACHER" &&
                        <div className="relative mb-8">
                            <h2 className={"font-bold text-primary-blue text-xl"}>
                                Thông tin giảng viên
                            </h2>

                            <div className={"grid grid-cols-9 mt-2"}>
                                <div className={"col-span-3 m-2"}>
                                    <b>Mã giảng viên:</b> <span className={"text-text-color"}>{profile?.teacherCode}</span>
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Chuyên ngành:</b> {profile?.major ? <span className={"text-text-color"}>{profile?.major.majorName}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Học vấn:</b> {profile?.major ? <span className={"text-text-color"}>{profile?.education}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}
                                </div>

                                
                            </div>
                        </div>
                    }

                </div>
            </BoxWrapper>

            {
                profile?.role === "STUDENT" ?
                    <div className="mb-5">
                        <BoxWrapper className="">
                        <div className="relative">
                            <h2 className={"font-bold text-primary-blue text-xl"}>
                                Thông tin đồ án
                            </h2>

                            <div className={"grid grid-cols-9 mt-2"}>
                                <div className={"col-span-3 m-2"}>
                                    <b>Điểm giáo viên hướng dẫn: </b> 
                                    {profile?.project?.scoreMentor}
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Điểm giáo viên phản biện: </b>
                                    {profile?.project?.scoreCommentator} 
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Điểm tổng kết:</b> 
                                    {profile?.project?.scoreFinal}
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Mã hội đồng chấm thi: </b> HỘI ĐỒNG 011111
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Giáo viên hướng dẫn:</b> 
                                    {
                                        profile?.project?.userNameMentorNavigation ? profile?.project?.userNameMentorNavigation?.fullName : <span className={"text-red-600"}>Chưa có</span>
                                    }
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Giáo viên phản biện: </b> 
                                    {
                                        profile?.project?.userNameCommentatorNavigation ? profile?.project?.userNameCommentatorNavigation?.fullName : <span className={"text-red-600"}>Chưa có</span>
                                    }
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Trạng thái làm đồ án:</b> 
                                    <span className={"text-text-color ms-2"}>chưa bảo vệ</span> 
                                </div>
                            </div>
                            <div className="flex justify-end" onClick={()=>navigate("/outline/"+profile?.userName)}>
                                <Button variant="outlined">Chi tiết đề cương</Button>
                            </div>
                        </div>
                        </BoxWrapper>
                    </div>
                : <></>
            }
        {
            profile?.project?.userNameMentorNavigation?.userName === info?.userName &&
                    <BoxWrapper className="mb-5">
                        <div>
                            <div>
                                <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                                    Lịch báo cáo tuần
                                </h2>
                                <div className="plant-content mb-6">
                                    <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                                        Kế hoạch đang thực hiện
                                    </h2>
                                    <div className="plant-now">
                                        {
                                            scheduleNow && scheduleNow.map((item)=>(
                                                <ScheduleItem 
                                                    key={item?.scheduleWeekId}
                                                    link={"/schedule-week/detail/"+item?.scheduleWeekId+"/"+profile?.userName} 
                                                    active={true} 
                                                    className={"mb-5"} 
                                                    header={item?.content || ""} 
                                                    dateTime={dateShowNotification(item?.fromDate,item?.toDate)} 
                                                />
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="plant-content mb-6">
                                    <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                                        Kế hoạch kết thúc
                                    </h2>
                                    <div className="plant-now">
                                        {
                                            schedulePast && schedulePast.map((item)=>(
                                                <ScheduleItem 
                                                    key={item?.scheduleWeekId}
                                                    link={"/schedule-week/detail/"+item?.scheduleWeekId+"/"+profile?.userName} 
                                                    active={false} 
                                                    className={""}
                                                    header={item?.content || ""} 
                                                    dateTime={dateShowNotification(item?.fromDate,item?.toDate)} 
                                                />
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="plant-content mb-6">
                                    <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                                        Kế hoạch sắp tới
                                    </h2>
                                    <div className="plant-now">
                                        {
                                            scheduleFuture && scheduleFuture.map((item)=>(
                                                <ScheduleItem 
                                                    key={item?.scheduleWeekId}
                                                    link={"/schedule-week/detail/"+item?.scheduleWeekId+"/"+profile?.userName} 
                                                    active={false} 
                                                    className={""}
                                                    header={item?.content || ""} 
                                                    dateTime={dateShowNotification(item?.fromDate,item?.toDate)} 
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BoxWrapper>               
            
        }
        {id === info?.userName && 
        
        <AccordionCustom header={"Đổi mật khẩu"} size="xl">
            <form className="p-5" onSubmit={formik.handleSubmit}>
                <div className={"mb-4"}>
                    <InputCustom
                        id="password" 
                        label={"Mật khẩu hiện tại"} 
                        name={"password"}
                        value={formik.values.password} 
                        isError={formik.touched.password && Boolean(formik.errors.password)} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorMessage={formik.touched.password && formik.errors.password} 
                    />
                </div>

                <div className={"mb-4"}>
                    <InputCustom
                        id="new_password" 
                        label={"Mật khẩu mới"} 
                        name={"new_password"}
                        value={formik.values.new_password} 
                        isError={formik.touched.new_password && Boolean(formik.errors.new_password)} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorMessage={formik.touched.new_password && formik.errors.new_password} 
                    />
                </div>

                <div className={"mb-4"}>
                    <InputCustom
                        id="new_password_2" 
                        label={"Nhập lại mật khẩu mới"} 
                        name={"new_password_2"}
                        value={formik.values.new_password_2} 
                        isError={formik.touched.new_password_2 && Boolean(formik.errors.new_password_2)} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorMessage={formik.touched.new_password_2 && formik.errors.new_password_2} 
                    />

                    
                </div>



                <Button variant="contained" type="submit" fullWidth>Đổi mật khẩu</Button>

            </form>

        </AccordionCustom>
        
        }

        </>
        }
    </>);
}

export default Profile;