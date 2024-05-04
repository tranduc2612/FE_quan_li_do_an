import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import images from "~/assets";

import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { ArrowLeft } from "mdi-material-ui";
import { useRef, useState } from "react";
import InputCustom from "~/components/InputCustom";
import { CheckInfoUser, changePasswordModel, checkForgotPassword, forgotPassword } from "~/services/userApi";
import { IUser } from "~/types/IUser";
import PageOtp from "./component-OTP";
import { IResponse } from "~/types/IResponse";
import { toast } from "react-toastify";


export enum EnumStepOTP{
    VERIFY_USERNAME,
    VERIFY_PHONE_NUMBER,
    SEND_REQUEST_OTP,
    CHANGE_PASSWORD,
} 

const validationSchema = yup.object({
    username: yup
      .string()
      .required('Tài khoản không được để trống'),
    phone: yup
      .string()
      .required('Số điện thoại không được để trống')
      .matches(/^[0-9]+$/, 'Số điện thoại không đúng định dạng'),
    new_password: yup
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 kí tự')
      .matches(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ viết thường')
      .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ viết hoa')
      .matches(/^[^\W_]+$/, "Mật khẩu không được chứa kí tự đặc biệt")
    //   .matches(/[$&+,:;=?@#|'<>.^*()%!-]/, "Mật khẩu không được chứa kí tự đặc biệt")
      .required('Mật khẩu không được để trống'),
    new_password_confirm: yup
      .string()
      .required('Mật khẩu không được để trống')
      
      .oneOf([yup.ref('new_password')], 'Mật khẩu không khớp'),
  });


function ForgetPassword() {
    const [step,setStep] = useState<EnumStepOTP>(EnumStepOTP.VERIFY_USERNAME)
    const [userFind,setUserFind] = useState<IUser>();
    const [loading,setLoading] = useState(false);
    const [confirmOtp,setConfirmOtp] = useState<any>();

    const capchaRef = useRef<any>();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username:"",
            phone: "",
            role:"STUDENT",
            new_password:"",
            new_password_confirm:"",
        },
        validationSchema: validationSchema,
        onSubmit: async (values,{setErrors}) => {
            console.log(values)
            const reqData: changePasswordModel = {
                userName: values.username || "",
                passwordOld: "s",
                passwordNew: values.new_password || "",
                role: values.role
            }
            forgotPassword(reqData)
            .then((res:IResponse<any>)=>{
                if(res.success){
                    toast.success(res.msg)
                    formik.resetForm();
                    navigate("/login")
                }else{
                    setErrors({ new_password: res.msg})
                }
            })
        },
    });
    

    const handleCheckUser = () =>{
        if(formik.values.username.length === 0){
            return
        }
        const reqData:checkForgotPassword = {
            userName: formik.values.username,
            role:formik.values.role
        }
        setLoading(true)
        CheckInfoUser(reqData)
        .then(async (res)=>{
                if(res.returnObj.typeError.length > 0){
                console.log(res)
                    formik.setErrors({
                        [res.returnObj.typeError]: res.returnObj.messageError
                    })
                }else{
                    setUserFind(res.returnObj.data);
                    setStep(EnumStepOTP.VERIFY_PHONE_NUMBER);
                }
        })
        .catch((err)=>{
            console.log(err)
        })
        .finally(()=>{
            setLoading(false)
        })
    }

    const handleSendOTP = async ()=>{
        console.log(formik.values.phone)
        console.log(userFind?.phone)

        if(formik.values.phone !== userFind?.phone){
            formik.setErrors({
                phone: "Số điện thoại không chính xác"
            })
            return
        }
        setStep(EnumStepOTP.SEND_REQUEST_OTP)
    }

    

    return (<>
        <div
        className={`w-screen h-screen relative overflow-hidden`}>
        <div className="w-full h-full z-10 ">
            <img className="w-full h-full" src={images.background.background_default} />
        </div>

        <div className="w-full h-full bg-white absolute z-20 left-0 top-0 opacity-35">

        </div>



        <div className="shadow-default rounded-md absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 w-3/12 h-3/12 min-h-90 bg-white z-30 p-8 flex items-center">
            
            {
                step !== EnumStepOTP.CHANGE_PASSWORD &&
                <div className="mb-5 p-2 absolute top-2 left-5 hover:bg-slate-200 rounded-full cursor-pointer" onClick={()=>{
                    if(step === EnumStepOTP.VERIFY_USERNAME){
                        navigate("/login")
                    }
                    if(step === EnumStepOTP.VERIFY_PHONE_NUMBER){
                        setStep(EnumStepOTP.VERIFY_USERNAME)
                    }
                    if(step === EnumStepOTP.SEND_REQUEST_OTP){
                        setStep(EnumStepOTP.VERIFY_PHONE_NUMBER)
                    }
                }}>
                    <ArrowLeft />
                </div>
            }
            <div className="box__authen flex justify-center items-center flex-col">
                <img className="w-4/12 mt-5 mb-5" src={images.logo.logo_default} alt="" />

                <div className="title mt-5 mb-5 text-center text-2xl">
                    {/* <h2>Welcome to UTC! 👋🏻</h2> */}
                    <h1 className="font-bold">QUÊN MẬT KHẨU</h1>
                </div>

                <form className="form flex justify-center flex-col w-full mt-5 mb-5" onSubmit={formik.handleSubmit}>
                    {
                        step === EnumStepOTP.VERIFY_USERNAME &&
                        <>
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
                            />
                             <div>
                                <RadioGroup
                                    row
                                    name="role"
                                    onChange={formik.handleChange}
                                    defaultValue="STUDENT"
                                >
                                    <FormControlLabel value="STUDENT" control={<Radio />} label="Sinh viên"/>
                                    <FormControlLabel value="TEACHER" control={<Radio />} label="Giảng viên" />
                                </RadioGroup>
                            </div>
                        </div>
                    <Link to="/login" className="mb-6 self-end hover:underline">Đăng nhập tài khoản</Link>
                    {
                        loading ? 
                        <LoadingButton  
                             loading
                             loadingPosition="start"
                             startIcon={<SaveIcon />}
                             variant="contained"
                        >Tiếp theo</LoadingButton>
                        :
                        <Button variant="contained" onClick={handleCheckUser}>Tiếp theo</Button>
                    }
                    </>
                    
                    }

                    {
                        step === EnumStepOTP.VERIFY_PHONE_NUMBER &&
                        <>
                            <div className="">
                                <InputCustom
                                    id={"phone"}
                                    label={userFind?.phone ? `********${userFind?.phone.slice(-3)}` : ""}
                                    name={"phone"}
                                    value={formik.values.phone} 
                                    isError={formik.touched.phone && Boolean(formik.errors.phone)} 
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    errorMessage={formik.touched.phone && formik.errors.phone} 
                                />
                            </div>
                            <span className="text-xs mb-5">*Nhập số điện thoại bạn đã đăng ký</span>
                            <Button variant="contained" onClick={handleSendOTP}>Gửi yêu cầu xác thực</Button>
                        </>
                        
                    }

                    {
                        step === EnumStepOTP.SEND_REQUEST_OTP &&
                        <>
                            <PageOtp phone={formik.values.phone} setStep={setStep}/>
                        </>
                    }

{
                        step === EnumStepOTP.CHANGE_PASSWORD &&
                        <>
                            <div className="mb-5">
                                <InputCustom
                                    id={"new_password"}
                                    label={"mật khẩu mới"}
                                    name={"new_password"}
                                    type="password"
                                    value={formik.values.new_password} 
                                    isError={formik.touched.new_password && Boolean(formik.errors.new_password)} 
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    errorMessage={formik.touched.new_password && formik.errors.new_password} 
                                />
                            </div>

                            <div className="mb-5">
                                <InputCustom
                                    id={"new_password_confirm"}
                                    label={"Nhập lại mật khẩu mới"}
                                    name={"new_password_confirm"}
                                    type="password"
                                    value={formik.values.new_password_confirm} 
                                    isError={formik.touched.new_password_confirm && Boolean(formik.errors.new_password_confirm)} 
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    errorMessage={formik.touched.new_password_confirm && formik.errors.new_password_confirm} 
                                />
                            </div>

                            <Button variant="contained" type="submit">Thay đổi mật khẩu</Button>
                        </>
                        
                    }
                    
                    
                </form>
                <div>

                </div>
            </div>
        </div>
    </div>
    
    </>);
}

export default ForgetPassword;