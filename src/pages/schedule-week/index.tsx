import Add from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import { ChevronLeft } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScheduleItem from "~/components/BoxItemPlant";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import LoadingData from "~/components/LoadingData";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { getListScheduleWeek } from "~/services/scheduleWeekApi";
import { getSemester } from "~/services/semesterApi";
import { IResponse } from "~/types/IResponse";
import { IScheduleSemester } from "~/types/IScheduleSemester";
import { IScheduleWeek } from "~/types/IScheduleWeek";
import { ISemester } from "~/types/ISemesterType";
import { dateShowNotification, formatDateTypeDateOnly, isCurrentTimeInRange } from "~/ultis/common";

function ScheduleWeek() {
    const navigate = useNavigate();
    const {idSemester} = useParams();
    const [loading,setLoading] = useState(true);
    const currentUser = useAppSelector(inforUser);
    const [semester,setSemester] = useState<ISemester>();
    const [scheduleNow,setScheduleNow] = useState<IScheduleWeek[]>([])
    const [schedulePast,setSchedulePast] = useState<IScheduleWeek[]>([])
    const [scheduleFuture,setScheduleFuture] = useState<IScheduleWeek[]>([])

    const formik = useFormik({
        initialValues: {
            semester: "",
        },
        onSubmit: (values) => {
          console.log(values);
        },
    });

    useEffect(()=>{
        if(idSemester){
            getSemester(idSemester)
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
    },[])

    const handleFetchApiData = ()=>{
        let userFind = "";
        if(currentUser?.role === "TEACHER"){
            userFind = currentUser?.userName || "";
        }
        console.log(currentUser)
        if(currentUser?.role === "STUDENT"){
            const teacherMentor = currentUser?.project?.userNameMentorNavigation;
            if(teacherMentor){
                userFind = teacherMentor?.userName || "";
            }
        }
        getListScheduleWeek(idSemester,userFind)
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
        <HeaderPageTitle pageName={"Kế hoạch tuần"} />
        <BoxWrapper className="">
            <div>
                {loading ? <LoadingData /> : 
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                Quay lại
                            </Button>
                            {
                                currentUser?.role === "TEACHER" &&
                                <Button onClick={()=>{navigate("/schedule-week/input/"+idSemester)}} variant="contained" startIcon={<Add />}>
                                    Thêm mới lịch
                                </Button>
                            }
                        </div>
                        <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                            Danh sách lịch báo cáo tuần
                        </h2>
                        <div className={"grid grid-cols-12 mb-5"}>
                            <div className={"col-span-6 m-2"}>
                                <b>Mã học kỳ:</b> <span className={"text-text-color"}>{semester?.semesterId}</span> 
                            </div>

                            <div className={"col-span-6 m-2"}>
                                <b>Tên học kỳ:</b> {semester?.nameSemester}
                            </div>

                            <div className={"col-span-6 m-2"}>
                                <b>Bắt đầu:</b> {formatDateTypeDateOnly(semester?.fromDate)}
                            </div>

                            <div className={"col-span-6 m-2"}>
                                <b>Kết thúc:</b> {formatDateTypeDateOnly(semester?.toDate)}
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
                                            link={currentUser?.role === "STUDENT"? "/schedule-week/detail/"+item?.scheduleWeekId+"/"+currentUser?.userName :"/schedule-week/detail/"+item?.scheduleWeekId} 
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
                                            link={currentUser?.role === "STUDENT"? "/schedule-week/detail/"+item?.scheduleWeekId+"/"+currentUser?.userName :"/schedule-week/detail/"+item?.scheduleWeekId} 
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
                                            link={currentUser?.role === "STUDENT"? "/schedule-week/detail/"+item?.scheduleWeekId+"/"+currentUser?.userName :"/schedule-week/detail/"+item?.scheduleWeekId} 
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
        </BoxWrapper>
    </>);
}

export default ScheduleWeek;