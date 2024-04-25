import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import LoadingData from "~/components/LoadingData";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { addEducation, updateEducation } from '~/services/educationApi';
import { addMajor, updateMajor } from "~/services/majorApi";
import { IEducationType } from '~/types/IEducationType';
import { IMajorType } from "~/types/IMajorType";


const validationSchema = yup.object({
    educationId: yup
      .string()
      .required('Mã học vấn không được để trống'),
      educationName: yup
      .string()
      .required('Tên học vấn không được để trống'),
      maxStudentMentor: yup
      .string()
      .required('Tên học vấn không được để trống')
      .min(1, 'Giá trị phải lớn hơn hoặc bằng 1')
      .max(50, 'Giá trị phải nhỏ hơn hoặc bằng 50')
  });



function InputEducation({setSwitchPageInput,switchPageInput,educationSelect,handleFetchApi}:any) {
    const [loading,setLoading] = useState(false);
    const infoUser = useAppSelector(inforUser);

    const [initData,setInitData] = useState()

    const formik = useFormik({
        initialValues: {
            educationId: "",
            educationName: "",
            maxStudentMentor: 0,
            createdAt: "",
            createdBy: ""
      },
        validationSchema: validationSchema,
        onSubmit: async (values,{ setSubmitting, setErrors, setStatus }) => {

            const dataSubmit: IEducationType = {
                educationId: formik.values.educationId,
                educationName: formik.values.educationName,
                maxStudentMentor: formik.values.maxStudentMentor,
                createdBy:  infoUser?.userName
            }
            console.log(dataSubmit)
            if(educationSelect.educationId.length > 0){
                const data = await updateEducation(dataSubmit);
                if(data.success){
                    setSwitchPageInput(false);
                    handleFetchApi();
                    toast.success(data.msg)
                }else{
                    console.log(data)
                    setErrors({ educationId: data.msg})
                }
            }else{
                const data = await addEducation(dataSubmit);
                if(data.success){
                    setSwitchPageInput(false);
                    handleFetchApi();
                    toast.success(data.msg)
                }else{
                    console.log(data)
                    setErrors({ educationId: data.msg})
                }
            }
        },
    });

    useEffect(()=>{
        if(educationSelect.educationId.length > 0){
            formik.setValues({
                educationId: educationSelect.educationId,
                educationName: educationSelect.educationName,
                maxStudentMentor: Number(educationSelect.maxStudentMentor),
                createdAt: educationSelect.createdAt,
                createdBy: educationSelect.createdBy
            })
        }
    },[])


    return ( <div>
        {
            loading ? <LoadingData /> : 
        <form action="" onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <InputCustom
                                id={"educationId"}
                                label="Mã học vấn"
                                name={"educationId"}
                                value={formik.values.educationId} 
                                readOnly={educationSelect?.educationId.length > 0 ? true : false}
                                disabled={educationSelect?.educationId.length > 0 ? true : false}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.educationId && Boolean(formik.errors.educationId)} 
                                errorMessage={formik.touched.educationId && formik.errors.educationId} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"educationName"}
                                label="Tên học vấn"
                                name={"educationName"}
                                value={formik.values.educationName} 
                                isError={formik.touched.educationName && Boolean(formik.errors.educationName)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.educationName && formik.errors.educationName} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"maxStudentMentor"}
                                label="Số lượng sinh viên quản lí tối đã"
                                name={"maxStudentMentor"}
                                type={"number"}
                                value={Number(formik.values.maxStudentMentor)} 
                                isError={formik.touched.maxStudentMentor && Boolean(formik.errors.maxStudentMentor)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.maxStudentMentor && formik.errors.maxStudentMentor} 
                            />
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

export default InputEducation;