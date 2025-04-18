import { useEffect, useId, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "~/assets";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { ILoginPayload, errorLogging, inforUser, isError, isLogin, logging, login, logout } from "~/redux/slices/authSlice";
import { decrement, increment, selectCount } from "~/redux/slices/counterSlice";
import { useFormik } from "formik";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import ButtonCustom from "~/components/ButtonCustom";
import Loading from "~/components/Loading";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FormikHelpers } from 'formik';
type IObjectField = {
    value: string
}

type IStateForm = {
    username: IObjectField,
    password: IObjectField
}

const validationSchema = yup.object({
    username: yup
      .string()
      .required('Tài khoản không được để trống'),
    password: yup
      .string()
      .required('Mật khẩu không được để trống'),
    //   role: yup
    //     .string()
  });

function LoginPage() {
    const uuid = useId();
    const [loadSubmit,setLoadSubmit] = useState(0);
    const isLoginUser = useAppSelector(isLogin);
    const isLogging = useAppSelector(logging);
    const isErrorLogin = useAppSelector(isError);
    const errorLoginUser = useAppSelector(errorLogging);
    const currentUser = useAppSelector(inforUser);
    const dispatch = useAppDispatch();
    console.log(currentUser)
    useEffect(()=>{
        formik.setErrors({[errorLoginUser.typeError]:errorLoginUser.messageError})
    },[loadSubmit,errorLoginUser])

    const formik = useFormik({
        initialValues: {
            username:"",
            password: "",
            role:"STUDENT"
        },
        validationSchema: validationSchema,
        onSubmit: async (values:ILoginPayload) => {
            console.log(values);
          dispatch(login(values));
          setLoadSubmit(loadSubmit+1)
        formik.setSubmitting(false);
        },
    });

    // const handleSubmit = ()=>{
    //     console.log(Object.entries(formik.errors))
    //     if(formik.errors.password && formik.errors.username){
    //         return
    //     }
    //         dispatch(login({
    //             username:formik.values.username,
    //             password: formik.values.password,
    //             role:formik.values.role
    //         }));

    //       formik.setSubmitting(false);
    //       setLoadSubmit(loadSubmit+1)
    // }



    return (<div
        className={`w-screen h-screen relative overflow-hidden`}>
        <div className="w-full h-full z-10 ">
            <img className="w-full h-full" src={images.background.background_default} />
        </div>

        <div className="w-full h-full bg-white absolute z-20 left-0 top-0 opacity-35">

        </div>



        <div className="shadow-default rounded-md absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 w-3/12 h-3/12 min-h-90 bg-white z-30 p-8 flex items-center">
            <div className="box__authen flex justify-center items-center flex-col">

                <img className="w-4/12 mt-5 mb-5" src={images.logo.logo_default} alt="" />

                <div className="title mt-5 mb-5 text-center text-2xl">
                    {/* <h2>Welcome to UTC! 👋🏻</h2> */}
                    <h1 className="font-bold">HỆ THỐNG QUẢN LÝ ĐỒ ÁN</h1>
                </div>

                <form className="form flex justify-center flex-col w-full mt-5 mb-5" onSubmit={formik.handleSubmit} key={uuid}>
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
                    </div>

                    <InputCustom
                        id={"password"}
                        label="Mật khẩu"
                        type="password"
                        name={"password"}
                        value={formik.values.password} 
                        isError={formik.touched.password && Boolean(formik.errors.password)} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorMessage={formik.touched.password && formik.errors.password} 
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
                    <Link to="/forget-password" className="mb-6 self-end hover:underline">Quên mật khẩu</Link>
                    <Button variant="contained" type="submit">Đăng nhập</Button>
                </form>
            </div>
        </div>

        {
            isLogging ? <Loading /> : <></>
        }

        {/* <div className="bg-white absolute bottom-10 right-0 w-56 h-56">
            <div className="admin text-black mb-10">
                <h1>Admin</h1>
                <div>Tài khoản: hoangvanthong</div>
                <div>Mật khẩu: 123456</div>
            </div>

            <div className="admin text-black">
                <h1>Sinh viên</h1>
                <div>Tài khoản: mã học kỳ_mã sinh viên</div>
                <div>Mật khẩu: ngày/tháng/năm</div>
            </div>
        </div> */}

        {/* <button onClick={handleDecrement}>Giảm</button>
        <button onClick={handleIncrement}>Tăng</button>
        <h1>
            {count}
        </h1>

        <>
            username : kminchelle
            <br />
            password : 0lelplR
            <br />
            <label>Tài khoản</label>
            <input onChange={(event) => {
                const value = event.target.value;
                setFormLogin({
                    ...formLogin,
                    username: value
                })
            }} />
            <br />
            <label>Mật khẩu</label>
            <input onChange={(event) => {
                const value = event.target.value;
                setFormLogin({
                    ...formLogin,
                    password: value
                })
            }} />
            <button type="button" onClick={handleLogin}>login</button>
            <button type="button" onClick={handleLogout}>logout</button>
            <br />
            <br />


            {currentUser?.firstName}
            <br />
            {currentUser?.lastName}
            <br />
            {currentUser?.gender}
            <br />
            <button onClick={() => navigate("/")}>Home</button>
        </> */}

    </div>);
}

export default LoginPage;