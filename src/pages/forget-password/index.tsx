import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "~/assets";
import BoxWrapper from "~/components/BoxWrap";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { ILoginPayload, inforUser, isLogin, login, logout } from "~/redux/slices/authSlice";
import { decrement, increment, selectCount } from "~/redux/slices/counterSlice";


import InputCustom from "~/components/InputCustom";
import ButtonCustom from "~/components/ButtonCustom";


function ForgetPassword() {
    const count = useAppSelector(selectCount);
    const isLoginUser = useAppSelector(isLogin);
    const currentUser = useAppSelector(inforUser);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formLogin, setFormLogin] = useState<ILoginPayload>({
        username: undefined,
        password: undefined
    })

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

    const handleLogout = () => {
        dispatch(logout())
    }
    return (<div
        // style={{
        //     backgroundImage: `url(${images.background.background_default})`
        // }}
        className={`w-screen h-screen relative overflow-hidden`}>
        <div className="w-full h-full z-10 ">
            <img className="w-full h-full" src={images.background.background_default} />
        </div>

        <div className="w-full h-full bg-white absolute z-20 left-0 top-0 opacity-35">

        </div>



        <BoxWrapper classStyle="absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 w-3/12 h-3/12 min-h-90 bg-white z-30 p-10 flex items-center">
            <div className="box__authen flex justify-center items-center flex-col">

                <img className="w-4/12 mt-5 mb-5" src={images.logo.logo_default} alt="" />

                <div className="title mt-5 mb-5 text-center text-2xl">
                    {/* <h2>Welcome to UTC! 👋🏻</h2> */}
                    <h1 className="font-bold">QUÊN MẬT KHẨU</h1>
                </div>

                <form className="form flex justify-center flex-col w-full mt-5 mb-5">
                    <InputCustom value={""} label="Tài khoản" />
                    <InputCustom value={""} label="Email đăng ký" />
                    <Link to="/forget-password" className="mb-6 self-start">Nhớ lại mật khẩu</Link>
                    <ButtonCustom label="Gửi mã xác nhận" onClick={handleLogin} />
                </form>
            </div>
        </BoxWrapper>



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

export default ForgetPassword;