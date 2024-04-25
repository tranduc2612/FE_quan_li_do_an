import { Button } from "@mui/material";
import classNames from "classnames/bind";
import { useFormik } from "formik";
import { Pencil } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';
import AccordionCustom from "~/components/AccordionCustom";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import InputCustom from "~/components/InputCustom";
import Loading from "~/components/Loading";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { GetProfileUser } from "~/services/userApi";
import { ICouncil } from "~/types/ICouncil";
import { IProjecType } from "~/types/IProjectType";
import { IResponse } from "~/types/IResponse";
import { IUser } from "~/types/IUser";
import { dateShowNotification, formatDateTypeDateOnly, isCurrentTimeInRange, renderGender, renderRole, renderStatusAccount } from "~/ultis/common";
import style from "./profile.module.scss";
import LoadingData from "~/components/LoadingData";
import ScheduleItem from "~/components/BoxItemPlant";
import { getListScheduleWeek } from "~/services/scheduleWeekApi";
import { IScheduleWeek } from "~/types/IScheduleWeek";
import { ISemester } from "~/types/ISemesterType";
import { getSemester } from "~/services/semesterApi";

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
    const [council,setCouncil] = useState<ICouncil>();
    const [profile,setProfile] = useState<IUser>();
    const [project,setProject] = useState<IProjecType>()
    const info = useAppSelector(inforUser)
    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [semester,setSemester] = useState<ISemester>();
    const [scheduleNow,setScheduleNow] = useState<IScheduleWeek[]>([])
    const [schedulePast,setSchedulePast] = useState<IScheduleWeek[]>([])
    const [scheduleFuture,setScheduleFuture] = useState<IScheduleWeek[]>([])

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
                    const req = res.returnObj
                    if(req?.project){
                        setProject(req.project)
                    }
                    if(req?.project?.council){
                        console.log(req?.project?.council)
                        setCouncil(req?.project?.council)
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

    useEffect(()=>{
        fetchApiSemester()
    },[project?.semesterId])

    const fetchApiSemester = ()=>{
        if(project?.semesterId){
            getSemester(project?.semesterId)
            .then((res:IResponse<ISemester>)=>{
                if(res.code && res.returnObj){
                    setSemester(res.returnObj)
                    handleFetchApiData()
                    setLoading(false)
                }else{
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    

    const handleFetchApiData = ()=>{
        let userFind = "";
        const teacherMentor = project?.userNameMentorNavigation;
        userFind = teacherMentor?.userName || "";
        
        getListScheduleWeek(project?.semesterId,userFind)
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
                                        navigate("/profile/input/"+id || "not-found")
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
                                <b>Trạng thái tài khoản:</b> {<span className={`${profile?.status === "BLOCK" ? "text-red-600" : "text-green-600"}`}>{renderStatusAccount(profile?.status)}</span>}  
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
                                    <b>Chuyên ngành:</b> {profile?.major ? <span className={"text-text-color"}>{profile?.major.majorName}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Học vị:</b> {profile?.major ? <span className={"text-text-color"}>{profile?.education}</span> : <span className={"text-red-600"}>Chưa đăng ký</span>}
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
                                    {project?.scoreMentor}
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Điểm giáo viên phản biện: </b>
                                    {project?.scoreCommentator} 
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Điểm tổng kết:</b> 
                                    {project?.scoreFinal}
                                </div>

                                

                                <div className={"col-span-3 m-2"}>
                                    <b>Giáo viên hướng dẫn:</b> 
                                    {
                                        project?.userNameMentorNavigation ? project?.userNameMentorNavigation?.fullName : <span className={"text-red-600"}>Chưa có</span>
                                    }
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Giáo viên phản biện: </b> 
                                    {
                                        project?.userNameCommentatorNavigation ? project?.userNameCommentatorNavigation?.fullName : <span className={"text-red-600"}>Chưa có</span>
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
            project == undefined && profile?.role === "TEACHER" ? <></> :
            <div className="mb-5">
                <AccordionCustom header={"Lịch báo cáo tuần"} size="xxl">
                    <div>
                        {loading ? <LoadingData /> :
                            <div className="p-5 py-0">
                                <div className={"grid grid-cols-12 mb-5 text-base"}>
                                    <div className={"col-span-6 m-2"}>
                                        <b>Mã học kỳ:</b> <span className={"text-text-color font-normal"}>{semester?.semesterId}22</span>
                                    </div>
                                    <div className={"col-span-6 m-2"}>
                                        <b>Tên học kỳ:</b> <span className={"text-text-color font-normal"}>{semester?.nameSemester}</span>
                                    </div>
                                    <div className={"col-span-6 m-2"}>
                                        <b>Bắt đầu:</b> <span className={"text-text-color font-normal"}>{formatDateTypeDateOnly(semester?.fromDate)}</span>
                                    </div>
                                    <div className={"col-span-6 m-2"}>
                                        <b>Kết thúc:</b> <span className={"text-text-color font-normal"}>{formatDateTypeDateOnly(semester?.toDate)}</span>
                                    </div>
                                </div>
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
                        }
                    </div>
                </AccordionCustom>
            </div>
        }
        {profile?.role == "STUDENT" && council ? 
            <div className="mb-5">
                <AccordionCustom header={"Hội đồng bảo vệ"} size="xxl">
                <div>
                    <div className="p-5 pt-0">
                        <div className={"grid grid-cols-10 mt-2 text-base"}>
                            <div className={"col-span-5 m-2"}>
                                <b>Tên hội động: </b> {council?.councilName}
                            </div>
                            <div className={"col-span-5 m-2"}>
                                <b>Địa điểm: </b> {council?.councilZoom}
                            </div>

                            <div className={"col-span-10 m-2 mb-0 text-primary-blue font-bold"}>
                                Chủ tịch
                            </div>
                            {/* Chủ tịch */}
                            <div className={"m-2 col-span-2"}>
                                <b>Điểm: </b> {project?.scoreCt}
                            </div>
                            <div className={"col-span-8"}>
                                <b>Nhận xét: </b>
                                <div className={"whitespace-pre-wrap"}>
                                    {project?.commentCt}
                                </div> 
                            </div>

                            <div className={"col-span-10 m-2 mb-0 text-primary-blue font-bold"}>
                                Thư ký
                            </div>
                            {/* Thư ký */}
                            <div className={"m-2 col-span-2"}>
                                <b>Điểm: </b> {project?.scoreTk}
                            </div>
                            <div className={"col-span-8"}>
                                <b>Nhận xét: </b>
                                <div className={"whitespace-pre-wrap"}>
                                    {project?.commentTk}
                                </div> 
                            </div>

                            <div className={"col-span-10 m-2 mb-0 text-primary-blue font-bold"}>
                                Ủy viên 1
                            </div>
                            {/* Ủy viên 1 */}
                            <div className={"m-2 col-span-2"}>
                                <b>Điểm: </b> {project?.scoreUv1}
                            </div>
                            <div className={"col-span-8"}>
                                <b>Nhận xét: </b>
                                <div className={"whitespace-pre-wrap"}>
                                    {project?.commentUv1}
                                </div> 
                            </div>

                            <div className={"col-span-10 m-2 mb-0 text-primary-blue font-bold"}>
                                Ủy viên 2
                            </div>
                            {/* Ủy viên 2 */}
                            <div className={"m-2 col-span-2"}>
                                <b>Điểm: </b> {project?.scoreUv2}
                            </div>
                            <div className={"col-span-8"}>
                                <b>Nhận xét: </b>
                                <div className={"whitespace-pre-wrap"}>
                                    {project?.commentUv2}
                                </div> 
                            </div>

                            <div className={"col-span-10 m-2 mb-0 text-primary-blue font-bold"}>
                                Ủy viên 3
                            </div>
                            {/* Ủy viên 3 */}
                            <div className={"m-2 col-span-2"}>
                                <b>Điểm: </b> {project?.scoreUv3}
                            </div>
                            <div className={"col-span-8"}>
                                <b>Nhận xét: </b>
                                <div className={"whitespace-pre-wrap"}>
                                    {project?.commentUv3}
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                </AccordionCustom>
            </div> : <></>        
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