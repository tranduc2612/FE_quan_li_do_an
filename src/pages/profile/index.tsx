import { useAppDispatch } from "~/redux/hook";
import classNames from "classnames/bind";
import style from "./profile.module.scss"
import { useNavigate } from "react-router-dom";
import AccordionCustom from "~/components/AccordionCustom";
import InputCustom from "~/components/InputCustom";
import { useState } from "react";
import ButtonCustom from "~/components/ButtonCustom";
import BoxWrapper from "~/components/BoxWrap";
import { Popper,Box, TextField, OutlinedInput, Button } from "@mui/material";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import { Pencil, TrashCanOutline } from "mdi-material-ui";
import ModalCustom from "~/components/Modal";
import { useFormik } from "formik";
import * as yup from 'yup';

const keyPost = '/api/user/123';
const cx = classNames.bind(style);

const validationSchema = yup.object({
    password: yup
      .string()
      .required('Mật khẩu không được để trống'),
    new_password: yup
      .string()
      .required('Mật khẩu không được để trống'),
    new_password_2: yup
      .string()
      .required('Mật khẩu không được để trống')
      .oneOf([yup.ref('new_password')], 'Mật khẩu không khớp'),
    
  });

function Profile() {
    // const [showAccountModal,setShowAccountModal] = useState(false);
    // const [showRoleModal,setRoleModal] = useState(false);

    const formik = useFormik({
        initialValues: {
          password: "",
          new_password:"",
          new_password_2:""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          console.log(values);
        },
      });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();



    return (<>
        <HeaderPageTitle pageName="Trang cá nhân" />
        <BoxWrapper className={" mb-5"}>
            <div>
                <div className="relative mb-8">
                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                        Thông tin tài khoản
                    </h2>
                    {/* <ModalCustom 
                        id={"1"} 
                        className="" 
                        title="Chỉnh sửa thông tin tài khoản" 
                        open={showAccountModal} 
                        handleSave={()=>{}} 
                        handleClose={()=>{
                            setShowAccountModal(false);
                        }}>
                        <div className="">
                            <form action="">
                                <div className="mb-6">
                                    <InputCustom 
                                        label={"Họ và tên"} 
                                        value={""} 
                                        name={""} 
                                        isError={false} 
                                        errorMessage={"sâdssasd"} 
                                        onChange={function (value: string): void {
                                            throw new Error("Function not implemented.");
                                        }} 
                                    />
                                </div>
                                



                                <div className="mb-6">
                                    <OutlinedInput placeholder="Please enter text" />
                                </div>
                            </form>    
                        </div>
                    </ModalCustom> */}


                    <div className="absolute right-0 top-0 flex tools">
                        <div className="flex items-center cursor-pointer p-2 rounded-full text-3xl me-2 hover:bg-gray-200"
                            onClick={()=>{
                                navigate("/profile/input/ductm")
                                // setShowAccountModal(true);
                            }}
                        >
                            <Pencil className="text-primary-blue" />
                        </div>
                    </div>

                    <div className={"grid grid-cols-9"}>
                        <div className={"col-span-3 m-2"}>
                            <b>Họ và tên:</b> <span className={"text-text-color"}>Trần Minh Đức</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Ngày sinh:</b> <span className={"text-text-color"}>26/12/2002</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Email:</b> <span className={"text-text-color"}>mintduc2612@gmail.com</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Số điện thoại:</b> <span className={"text-text-color"}>0367218700</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Vai trò:</b> <span className={"text-text-color"}>Sinh viên</span> 
                        </div>
                    </div>
                </div>

                <div className="relative mb-8">
                    <h2 className={"font-bold text-primary-blue text-xl"}>
                        Thông tin sinh viên
                    </h2>

                    <div className={"grid grid-cols-9 mt-2"}>
                        <div className={"col-span-3 m-2"}>
                            <b>Mã sinh viên:</b> <span className={"text-text-color"}>201210096</span>
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Chuyên nghành:</b> <span className={"text-text-color"}>Công nghệ phần mềm</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Trạng thái làm đồ án:</b> <span className={"text-text-color"}>Bảo lưu || Đang làm đồ án || Đã bảo vệ || chưa bảo vệ</span> 
                        </div>
                    </div>
                </div>
            </div>
        </BoxWrapper>

        <AccordionCustom header={"Đổi mật khẩu"}>
            <form onSubmit={formik.handleSubmit}>
                <div className={"mb-4"}>
                    <InputCustom
                        id="password" 
                        label={"Mật khẩu hiện tại"} 
                        name={"password"}
                        value={formik.values.password} 
                        isError={formik.touched.password && Boolean(formik.errors.password)} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorMessage={formik.touched.password && formik.errors.password} 
                    />
                </div>

                <div className={"mb-4"}>
                    <InputCustom
                        id="new_password" 
                        label={"Mật khẩu mới"} 
                        name={"new_password"}
                        value={formik.values.new_password} 
                        isError={formik.touched.new_password && Boolean(formik.errors.new_password)} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorMessage={formik.touched.new_password && formik.errors.new_password} 
                    />
                </div>

                <div className={"mb-4"}>
                    <InputCustom
                        id="new_password_2" 
                        label={"Nhập lại mật khẩu mới"} 
                        name={"new_password_2"}
                        value={formik.values.new_password_2} 
                        isError={formik.touched.new_password_2 && Boolean(formik.errors.new_password_2)} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorMessage={formik.touched.new_password_2 && formik.errors.new_password_2} 
                    />
                </div>



                <Button variant="contained" type="submit" fullWidth>Đổi mật khẩu</Button>

            </form>

        </AccordionCustom>
    </>);
}

export default Profile;