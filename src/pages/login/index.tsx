import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { ILoginPayload, inforUser, isLogin, login, logout } from "~/redux/slices/authSlice";
import { decrement, increment, selectCount } from "~/redux/slices/counterSlice";

function LoginPage() {
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
    return (<div>
        <button onClick={handleDecrement}>Giảm</button>
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
        </>

    </div>);
}

export default LoginPage;