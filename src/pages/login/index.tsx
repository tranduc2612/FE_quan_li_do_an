import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "~/assets";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { ILoginPayload, errorLogging, inforUser, isError, isLogin, logging, login, logout } from "~/redux/slices/authSlice";
import { decrement, increment, selectCount } from "~/redux/slices/counterSlice";

import InputCustom from "~/components/InputCustom";
import ButtonCustom from "~/components/ButtonCustom";
import Loading from "~/components/Loading";

type IObjectField = {
    value: string
}

type IStateForm = {
    username: IObjectField,
    password: IObjectField
}

function LoginPage() {
    const count = useAppSelector(selectCount);
    const isLoginUser = useAppSelector(isLogin);
    const isLogging = useAppSelector(logging);
    const isErrorLogin = useAppSelector(isError);
    const errorLoginUser = useAppSelector(errorLogging);
    console.log(errorLoginUser);
    const currentUser = useAppSelector(inforUser);
    console.log(currentUser)
    const dispatch = useAppDispatch();

    const [formLogin, setFormLogin] = useState<ILoginPayload>({
        username: undefined,
        password: undefined
    })

    // const [formLogin, setFormLogin] = useState<ILoginPayload>({
    //     username: "",
    //     password: ""
    // })

    const handleDecrement = () => {
        console.log(currentUser);
        dispatch(decrement())
    }
    const handleIncrement = () => {
        dispatch(increment())
    }

    const handleLogin = () => {
        dispatch(login(formLogin))
    }



    return (<div
        className={`w-screen h-screen relative overflow-hidden`}>
        <div className="w-full h-full z-10 ">
            <img className="w-full h-full" src={images.background.background_default} />
        </div>

        <div className="w-full h-full bg-white absolute z-20 left-0 top-0 opacity-35">

        </div>



        <div className="shadow-default rounded-md absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 w-3/12 h-3/12 min-h-90 bg-white z-30 p-10 flex items-center">
            <div className="box__authen flex justify-center items-center flex-col">

                <img className="w-4/12 mt-5 mb-5" src={images.logo.logo_default} alt="" />

                <div className="title mt-5 mb-5 text-center text-2xl">
                    {/* <h2>Welcome to UTC! 👋🏻</h2> */}
                    <h1 className="font-bold">HỆ THỐNG QUẢN LÝ ĐỒ ÁN</h1>
                </div>

                <form className="form flex justify-center flex-col w-full mt-5 mb-5">
                    <InputCustom
                        name={"account"}
                        label="Tài khoản"
                        isError={isErrorLogin && errorLoginUser.typeError == "Error System" ? true : false}
                        errorMessage={isErrorLogin && errorLoginUser.typeError == "Error System" ? errorLoginUser.messageError : ""}
                        value={formLogin.username || ""}
                        onChange={(value: string) => {
                            setFormLogin({
                                ...formLogin,
                                username: value
                            })
                        }}
                    />
                    <InputCustom
                        name={"password"}
                        label="Mật khẩu"
                        isError={isErrorLogin && errorLoginUser.typeError == "password" ? true : false}
                        errorMessage={isErrorLogin && errorLoginUser.typeError == "password" ? errorLoginUser.messageError : ""}
                        value={formLogin.password || ""}
                        onChange={(value: string) => {
                            setFormLogin({
                                ...formLogin,
                                password: value
                            })
                        }}
                    />
                    <Link to="/forget-password" className="mb-6 self-end">Quên mật khẩu</Link>
                    <ButtonCustom label="Đăng nhập" onClick={handleLogin} />
                </form>
            </div>
        </div>

        {
            isLogging ? <Loading /> : <></>
        }

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