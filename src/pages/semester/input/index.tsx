import { Button } from "@mui/material";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import InputCustom from "~/components/InputCustom";
import { useFormik } from "formik";
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { ChevronLeft } from "mdi-material-ui";
import { useNavigate } from "react-router-dom";
import TimePickerCustom from "~/components/InputTimePicker";
import { useState } from "react";
import { convertDayjsToDateTime } from "~/ultis/common";
import dayjs, { Dayjs } from "dayjs";
import { ISemester } from "~/types/ISemesterType";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { addSemester } from "~/services/semesterApi";
import { toast } from "react-toastify";

const validationSchema = yup.object({
    semesterId: yup
      .string()
      .required('Mã học kỳ không được để trống'),
      semesterName: yup
      .string()
      .required('Tên học kỳ không được để trống')
  });


function SemesterInput() {
    const navigate = useNavigate();
    const info = useAppSelector(inforUser);
    const [fromDate,setFromDate] = useState<any>(dayjs(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)));
    const [toDate,setToDate] = useState<any>(dayjs(new Date()));
    
    const formik = useFormik({
        initialValues: {
            semesterId: "",
            semesterName: "",
            fromDate: convertDayjsToDateTime(fromDate),
            toDate: convertDayjsToDateTime(toDate),
      },
        validationSchema: validationSchema,
        onSubmit: async (values,{ setSubmitting, setErrors, setStatus }) => {
            const dataSubmit: ISemester = {
                semesterId: formik.values.semesterId,
                nameSemester: formik.values.semesterName,
                fromDate: convertDayjsToDateTime(fromDate),
                toDate: convertDayjsToDateTime(toDate),
                createdBy: info?.userName
            }
            const data = await addSemester(dataSubmit);
            if(data.success){
                toast.success(data.msg)
                navigate("/semester")
            }else{
                console.log(data)
                setErrors({ semesterId: data.msg})
            }
        },
    });

    return ( 
    <>
        <HeaderPageTitle pageName="Quản lý học kỳ" pageChild="Thêm mới" />
        <BoxWrapper className={" mb-5"}>
            <>
                <div className="mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                </div>
                <form onSubmit={formik.handleSubmit}>
                            <div className="relative mb-8">
                                <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                                    Thêm mới học kỳ
                                </h2>

                                <div className={"grid grid-cols-9"}>
                                    <div className={"col-span-9 m-2"}>
                                        {/* <b>Họ và tên:</b> <span className={"text-text-color"}>Trần Minh Đức</span>  */}
                                        <InputCustom
                                            id={"semesterId"}
                                            label="Mã học kỳ"
                                            name={"semesterId"}
                                            value={formik.values.semesterId} 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isError={formik.touched.semesterId && Boolean(formik.errors.semesterId)} 
                                            errorMessage={formik.touched.semesterId && formik.errors.semesterId} 
                                        />
                                    </div>

                                    <div className={"col-span-9 m-2"}>
                                        {/* <b>Họ và tên:</b> <span className={"text-text-color"}>Trần Minh Đức</span>  */}
                                        <InputCustom
                                            id="semesterName" 
                                            label={"Tên học kỳ"} 
                                            name={"semesterName"}
                                            value={formik.values.semesterName} 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isError={formik.touched.semesterName && Boolean(formik.errors.semesterName)} 
                                            errorMessage={formik.touched.semesterName && formik.errors.semesterName}
                                        />
                                    </div>

                                        <div className="col-span-9 m-2">
                                            <TimePickerCustom label="Từ ngày"
                                                value={fromDate} 
                                                name={"fromDate"} 
                                                type={"DatePicker"}
                                                maxDate={toDate}
                                                onChange={(e)=>{
                                                    setFromDate(e);
                                                }} 
                                                />
                                        </div>

                                        <div className="col-span-9 m-2">
                                            <TimePickerCustom label="Đến ngày"
                                                value={toDate}
                                                name={"toDate"} 
                                                type={"DatePicker"}
                                                minDate={fromDate}
                                                onChange={(e)=>{
                                                    setToDate(e);
                                                }} 
                                                />
                                        </div>


                                </div>
                                <div className="flex justify-end px-2 pt-5">
                                    <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                                        Thêm mới học kỳ
                                    </Button>
                                </div>
                        </div>
                </form>
            </>
        </BoxWrapper>
    </> 
    );
}

export default SemesterInput;