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
import { addMajor, updateMajor } from "~/services/majorApi";
import { IMajorType } from "~/types/IMajorType";


const validationSchema = yup.object({
    majorId: yup
      .string()
      .required('Mã chuyên ngành không được để trống'),
    majorName: yup
      .string()
      .required('Tên chuyên ngành không được để trống')
  });



function InputMajor({setSwitchPageInput,switchPageInput,majorSelect,handleFetchApi}:any) {
    const [loading,setLoading] = useState(false);
    const infoUser = useAppSelector(inforUser);

    const [initData,setInitData] = useState()

    const formik = useFormik({
        initialValues: {
            majorId:"",
            majorName:"",
            createdAt: "",
            createdBy: ""
      },
        validationSchema: validationSchema,
        onSubmit: async (values,{ setSubmitting, setErrors, setStatus }) => {

            const dataSubmit: IMajorType = {
                majorId: formik.values.majorId,
                majorName: formik.values.majorName,
                createdBy:  infoUser?.userName
            }
            console.log(dataSubmit)
            if(majorSelect.majorId.length > 0){
                const data = await updateMajor(dataSubmit);
                if(data.success){
                    setSwitchPageInput(false);
                    handleFetchApi();
                    toast.success(data.msg)
                }else{
                    console.log(data)
                    setErrors({ majorId: data.msg})
                }
            }else{
                const data = await addMajor(dataSubmit);
                if(data.success){
                    setSwitchPageInput(false);
                    handleFetchApi();
                    toast.success(data.msg)
                }else{
                    console.log(data)
                    setErrors({ majorId: data.msg})
                }
            }
        },
    });

    useEffect(()=>{
        if(majorSelect.majorId.length > 0){
            formik.setValues({
                majorId: majorSelect?.majorId,
                majorName:majorSelect?.majorName,
                createdAt: majorSelect?.createdAt.toString(),
                createdBy: majorSelect?.createdBy
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
                                id={"majorId"}
                                label="Mã chuyên ngành"
                                name={"majorId"}
                                value={formik.values.majorId} 
                                readOnly={majorSelect?.majorId.length > 0 ? true : false}
                                disabled={majorSelect?.majorId.length > 0 ? true : false}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.majorId && Boolean(formik.errors.majorId)} 
                                errorMessage={formik.touched.majorId && formik.errors.majorId} 
                            />
                        </div>

                        <div className="col-span-12">
                            <InputCustom
                                id={"majorName"}
                                label="Tên chuyên ngành"
                                name={"majorName"}
                                value={formik.values.majorName} 
                                isError={formik.touched.majorName && Boolean(formik.errors.majorName)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.majorName && formik.errors.majorName} 
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

export default InputMajor;