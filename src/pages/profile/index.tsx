import { useAppDispatch } from "~/redux/hook";
import classNames from "classnames/bind";
import style from "./profile.module.scss"
import { useNavigate } from "react-router-dom";
import AccordionCustom from "~/components/AccordionCustom";
import InputCustom from "~/components/InputCustom";
import { useState } from "react";
import ButtonCustom from "~/components/ButtonCustom";


const keyPost = '/api/user/123';
const cx = classNames.bind(style);

function Profile() {
    const [currentPassword, setCurrentPassword] = useState({
        value: "",
        isError: false,
        msg: ""
    })
    const [newPassword, setNewPassword] = useState({
        value: "",
        isError: false,
        msg: ""
    })
    const [newPassword2, setNewPassword2] = useState({
        value: "",
        isError: false,
        msg: ""
    })

    const navigate = useNavigate();

    const dispatch = useAppDispatch();


    return (<>
        <div className={"w-full mb-5 shadow-md-light rounded-md p-8"}>
            <div className="mb-8">
                <h2 className={"font-bold text-[#333] text-xl"}>
                    Thông tin tài khoản
                </h2>

                <div className={"grid grid-cols-9 mt-2"}>
                    <div className={"col-span-3 m-2"}>
                        <b>Họ và tên:</b> Trần Minh Đức
                    </div>

                    <div className={"col-span-3 m-2"}>
                        <b>Ngày sinh:</b> 26/12/2002
                    </div>

                    <div className={"col-span-3 m-2"}>
                        <b>Email:</b> mintduc2612@gmail.com
                    </div>

                    <div className={"col-span-3 m-2"}>
                        <b>Số điện thoại:</b> 0367218700
                    </div>

                    <div className={"col-span-3 m-2"}>
                        <b>Vai trò:</b> Sinh viên
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className={"font-bold text-[#333] text-xl"}>
                    Thông tin sinh viên
                </h2>

                <div className={"grid grid-cols-9 mt-2"}>
                    <div className={"col-span-3 m-2"}>
                        <b>Mã sinh viên:</b> 201210096
                    </div>

                    <div className={"col-span-3 m-2"}>
                        <b>Chuyên nghành:</b> Công nghệ phần mềm
                    </div>

                    <div className={"col-span-3 m-2"}>
                        <b>Trạng thái làm đồ án:</b> Bảo lưu || Đang làm đồ án || Đã bảo vệ || chưa bảo vệ
                    </div>
                </div>
            </div>
        </div>

        <AccordionCustom header={"Đổi mật khẩu"}>
            <div>
                <div className={"mb-4"}>
                    <InputCustom label={"Mật khẩu hiện tại"} name={"currentPassword"} value={currentPassword.value} isError={currentPassword.isError} errorMessage={currentPassword.msg} onChange={(value) => {
                        setCurrentPassword({
                            ...currentPassword,
                            value
                        });
                    }} />
                    <InputCustom label={"Mật khẩu mới"} name={"newPassword"} value={newPassword.value} isError={newPassword.isError} errorMessage={newPassword.msg} onChange={(value) => {
                        setNewPassword({
                            ...currentPassword,
                            value
                        });
                    }} />
                    <InputCustom label={"Nhập lại mật khẩu mới"} name={"newPasswordAgain"} value={newPassword2.value} isError={newPassword2.isError} errorMessage={newPassword2.msg} onChange={(value) => {
                        setNewPassword2({
                            ...newPassword2,
                            value
                        });
                    }} />
                </div>



                <ButtonCustom label={"Đổi mật khẩu"} onClick={() => {
                    console.log(currentPassword);
                    console.log(newPassword);
                    console.log(newPassword2);
                }}></ButtonCustom>

            </div>

        </AccordionCustom>
    </>);
}

export default Profile;