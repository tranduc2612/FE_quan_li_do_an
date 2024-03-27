import InputCustom from "~/components/InputCustom";
import InputSelectCustom from "~/components/InputSelectCustom";
import TimePickerCustom from "~/components/InputTimePicker";
import * as yup from 'yup';
import { useFormik } from "formik";
import { ISemester } from "~/types/ISemesterType";
import { useEffect, useState } from "react";
import { getListSemester } from "~/services/semesterApi";
import { IResponse } from "~/types/IResponse";
import { Button, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import BoxWrapper from "~/components/BoxWrap";
import { ChevronLeft } from "mdi-material-ui";
import { useNavigate, useParams } from "react-router-dom";
import { addScheduleWeek, getScheduleWeek, updateScheduleWeek } from "~/services/scheduleWeekApi";
import { IScheduleWeek } from "~/types/IScheduleWeek";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { toast } from "react-toastify";
import Add from "@mui/icons-material/Add";

const validationSchema = yup.object({
    semesterId: yup
      .string()
      .required('Học kỳ không được để trống'),
    title: yup
      .string()
      .required('Tiêu dề không được để trống'),
    content: yup
      .string()
      .required('Nội dung không được để trống'),

  });
function ScheduleWeekInput() {
    const [semesterOption,setSemesterOption] = useState<ISemester[]>([])
    const {idSemester,idScheduleWeek} = useParams();
    const info = useAppSelector(inforUser);
    const [data,setData] = useState<IScheduleWeek>();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title:"",
            content:"",
            fromDate: dayjs(new Date().setDate(new Date().getDate() - 7)),
            toDate: dayjs(new Date()),
            semesterId:""
      },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if(idSemester){
                const req: IScheduleWeek = {
                    fromDate: values.fromDate.toDate(),
                    toDate: values.toDate.toDate(),
                    createdBy: info?.userName,
                    createdDate: new Date(),
                    semesterId: values.semesterId,
                    title: values.title,
                    content: values.content
                }
                addScheduleWeek(req)
                    .then((res:IResponse<any>)=>{{
                        if(res.success && res.returnObj){
                            toast.success(res.msg)
                            navigate("/schedule-week/detail/"+res.returnObj);
                        }else{
                            toast.error(res.msg)
                        }
                    }})
                    .catch((err)=>{
                        console.log(err)
                    })
            }

            if(idScheduleWeek){
                const req: IScheduleWeek = {
                    scheduleWeekId: idScheduleWeek,
                    fromDate: values.fromDate.toDate(),
                    toDate: values.toDate.toDate(),
                    createdBy: info?.userName,
                    semesterId: values.semesterId,
                    title: values.title,
                    content: values.content
                }
                updateScheduleWeek(req)
                    .then((res:IResponse<any>)=>{{
                        if(res.success){
                            toast.success(res.msg)
                            navigate("/schedule-week/detail/"+idScheduleWeek);
                        }else{
                            toast.error(res.msg)
                        }
                    }})
                    .catch((err)=>{
                        console.log(err)
                    })
            }
        },
    });

    

    const handleFetchApiSemesterOption = () =>{
        getListSemester(
            {
                semesterId: "",
                nameSemester: ""
            }
        )
        .then((res:IResponse<ISemester[]>)=>{
            console.log(res)
            if(res.success && res.returnObj && res.returnObj.length > 0){
                setSemesterOption(res.returnObj);
                // khi thêm mới
                if(idSemester){
                    console.log(idSemester)
                    formik.values.semesterId = idSemester;
                }
            }
        })
    }

    useEffect(()=>{
        handleFetchApiSemesterOption()
        if(idScheduleWeek){
            // khi sửa
            // call api chi tiết
            getScheduleWeek(idScheduleWeek)
            .then((res:IResponse<IScheduleWeek>)=>{
                if(res.success && res.returnObj){
                    const data = res.returnObj;
                    formik.values.title = data.title || ""
                    formik.values.content = data.content || ""
                    formik.values.fromDate = dayjs(new Date(data.fromDate || ""))
                    formik.values.toDate = dayjs(new Date(data.toDate || ""))
                    formik.values.semesterId = data.semesterId || ""         
                    setData(res.returnObj)
                }
            })
        }
    },[])
    
    return ( 
    <>
        <BoxWrapper className="">
                <div className="p-4 pt-2">
                    <div className="flex justify-between items-end mb-4">
                        <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                        </Button>
                    </div>
                    <h2 className={"font-bold text-primary-blue text-2xl mb-5"}>
                        {idSemester && "Thêm mới lịch báo cáo tuần"}
                        {idScheduleWeek && "Chỉnh sửa lịch báo cáo tuần"}
                    </h2>
                    <form action="" onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12">
                                    <InputSelectCustom
                                        id={"semesterId"}
                                        name={"semesterId"}
                                        onChange={formik.handleChange}
                                        value={formik.values.semesterId}
                                        placeholder="Học kỳ"
                                        label="Học kỳ"
                                        onBlur={undefined}
                                        readOnly={true}
                                    >
                                            {
                                                semesterOption && semesterOption.map((x)=>{
                                                    return <MenuItem key={x.semesterId} value={x.semesterId}>{x.nameSemester}</MenuItem>
                                                })
                                            }
                                    </InputSelectCustom>
                                </div>

                                <div className="col-span-12">
                                    <InputCustom
                                        id={"title"}
                                        label="Tiêu đề"
                                        name={"title"}
                                        value={formik.values.title} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isError={formik.touched.title && Boolean(formik.errors.title)} 
                                        errorMessage={formik.touched.title && formik.errors.title} 
                                    />
                                </div>

                                <div className="col-span-12">
                                    <InputCustom
                                        id={"content"}
                                        label="Nội dung"
                                        name={"content"}
                                        value={formik.values.content} 
                                        isError={formik.touched.content && Boolean(formik.errors.content)} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        multiline={true}
                                        errorMessage={formik.touched.content && formik.errors.content} 
                                    />
                                </div>

                                <div className="col-span-12">
                                    <TimePickerCustom 
                                        label="Từ ngày"
                                        value={formik.values.fromDate}  
                                        name={"fromDate"} 
                                        type={"DatePicker"}
                                        maxDate={formik.values.toDate}
                                        onChange={(e)=>{
                                            formik.values.fromDate = e;
                                        }} 
                                        />
                                </div>

                                <div className="col-span-12">
                                    <TimePickerCustom label="Đến ngày"
                                        value={formik.values.toDate}
                                        name={"toDate"} 
                                        type={"DatePicker"}
                                        minDate={formik.values.fromDate}
                                        onChange={(e)=>{
                                            formik.values.toDate = e
                                        }} 
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-5">
                                <div className="flex">
                                    <div className="me-2">
                                        <Button type="submit" variant="contained" startIcon={idScheduleWeek ? <CheckIcon /> : <Add />}>
                                            {idScheduleWeek ? "Lưu" : "Thêm mới"}
                                        </Button>
                                    </div>
                                    <div>
                                        <Button variant="text" onClick={()=>{
                                            formik.resetForm();
                                        }}>
                                            <RefreshIcon />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                    </form>
                </div>
    </BoxWrapper>
    
    </> );
}

export default ScheduleWeekInput;