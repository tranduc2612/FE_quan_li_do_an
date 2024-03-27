import { MenuItem } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import ScheduleItem from "~/components/BoxItemPlant";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import InputSelectCustom from "~/components/InputSelectCustom";
import LoadingData from "~/components/LoadingData";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { getListScheduleSemester } from "~/services/scheduleSemesterApi";
import { getListSemester } from "~/services/semesterApi";
import { IResponse } from "~/types/IResponse";
import { IScheduleSemester } from "~/types/IScheduleSemester";
import { ISemester } from "~/types/ISemesterType";
import { dateShowNotification, formatDateTypeDateOnly, isCurrentTimeInRange } from "~/ultis/common";

function ScheduleSemesterPage() {
    const [loading,setLoading] = useState(false);
    const info = useAppSelector(inforUser);
    const [semester,setSemester] = useState<ISemester>();
    const [semesterOption,setSemesterOption] = useState<ISemester[]>([])
    const [scheduleNow,setScheduleNow] = useState<IScheduleSemester[]>([])
    const [schedulePast,setSchedulePast] = useState<IScheduleSemester[]>([])
    const [scheduleFuture,setScheduleFuture] = useState<IScheduleSemester[]>([])

    const formik = useFormik({
        initialValues: {
            semester: "",
        },
        onSubmit: (values) => {
          console.log(values);
        },
    });
    useEffect(()=>{
        getListSemester(
            {
                semesterId: formik.values.semester,
                nameSemester: ""
            }
        )
        .then((res:IResponse<ISemester[]>)=>{
            if(res.success && res.returnObj && res.returnObj.length > 0){
                if(info?.role === "STUDENT"){
                    formik.values.semester = info?.project?.semesterId || ""
                }
                if(info?.role === "TEACHER"){
                    formik.values.semester = res.returnObj[0].semesterId ? res.returnObj[0].semesterId : "";
                }
                setSemesterOption(res.returnObj);
            }
        })

        
    },[])

    useEffect(()=>{
        // setLoading(true);
        if(formik.values.semester.length !== 0){
            setSemester(semesterOption.find((item)=>item.semesterId===formik.values.semester))
            getListScheduleSemester(formik.values.semester)
                .then((res: IResponse<IScheduleSemester[]>)=>{
                    console.log(res)
                    const lstPast: IScheduleSemester[] = [];
                    const lstNow: IScheduleSemester[] = [];
                    const lstFur: IScheduleSemester[] = [];
                    if(res.success && res.returnObj && res.returnObj.length > 0){
                        const lstSchedule = res.returnObj;

                        lstSchedule.map((item:IScheduleSemester)=>{
                            console.log(item?.fromDate, item?.toDate)
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
                    console.log(lstPast)
                    setSchedulePast(lstPast);
                    setScheduleNow(lstNow)
                    setScheduleFuture(lstFur)
                })
        }
        // setLoading(false);
    },[formik.values.semester])
    
    return (<>
        <HeaderPageTitle pageName={"Kế hoạch khoa"} />
        <BoxWrapper className="">
            <div>
                {info?.role === "TEACHER" &&
                    <div className="grid grid-cols-3 mb-5">
                        <div className="col-span-1">
                            <InputSelectCustom
                                id={"semester"}
                                name={"semester"}
                                onChange={formik.handleChange}
                                value={formik.values.semester}
                                placeholder="Học kỳ"
                                label="Học kỳ"
                                onBlur={undefined}
                            >
                                {
                                    semesterOption && semesterOption.map((x)=>{
                                        return <MenuItem key={x.semesterId} value={x.semesterId}>{x.nameSemester}</MenuItem>
                                    })
                                }
                            </InputSelectCustom>
                        </div>
                    </div>
                }
                {loading ? <LoadingData /> : 
                    <div>
                        <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                            Kế hoạch thực hiện đồ án tốt nghiệp
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
                                            key={item?.scheduleSemesterId}
                                            link={"/schedule-semester/detail/"+item?.scheduleSemesterId} 
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
                                            key={item?.scheduleSemesterId}
                                            link={"/schedule-semester/detail/"+item?.scheduleSemesterId} 
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
                                            key={item?.scheduleSemesterId}
                                            link={"/schedule-semester/detail/"+item?.scheduleSemesterId} 
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

export default ScheduleSemesterPage;