import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useFormik } from 'formik';
import InputCustom from "~/components/InputCustom";
import TimePickerCustom from "~/components/InputTimePicker";
import * as yup from 'yup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button, InputLabel } from "@mui/material";
import { useState } from "react";
import InputSelectCustom from "~/components/InputSelectCustom";
import { Pencil } from "mdi-material-ui";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "mdi-material-ui";


interface MyFormValues {
    fullname: string,

  }

  const validationSchema = yup.object({
    fullname: yup
      .string()
      .required('Họ và tên không được để trống'),
    email: yup
      .string()
      .email("Email không đúng định dạng")
      .required('Email không được để trống'),
    phone: yup
        .string()
        .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không đúng định dạng')
        .required('Điện thoại không được để trống'),
    student_code: yup
        .string()
        .required('Mã sinh viên không được để trống')
  });

function ProfileInput() {
    const navigate = useNavigate();
    const [roleValue,setRoleValue] = useState("")
    const [majorValue,setMajorValue] = useState("")
    const [statusProjectValue,setStatusProjectValue] = useState("")

    const formik = useFormik({
        initialValues: {
          fullname: "",
          email:"",
          phone:"",
          role:"",
          student_code:""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          console.log(values);
        },
      });
    return ( <>
        <HeaderPageTitle pageName="Trang cá nhân" pageChild="Chỉnh sửa" />
        <BoxWrapper className={" mb-5"}>
            <>
                <div className="mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                </div>
                <form onSubmit={formik.handleSubmit}>
                        <div>
                            <div className="relative mb-8">
                                <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                                    Thông tin tài khoản
                                </h2>

                                <div className={"grid grid-cols-9"}>
                                    <div className={"col-span-3 m-2"}>
                                        {/* <b>Họ và tên:</b> <span className={"text-text-color"}>Trần Minh Đức</span>  */}
                                        <InputCustom
                                            id="fullname" 
                                            label={"Họ và tên"} 
                                            name={"fullname"}
                                            value={formik.values.fullname} 
                                            isError={formik.touched.fullname && Boolean(formik.errors.fullname)} 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            errorMessage={formik.touched.fullname && formik.errors.fullname} 
                                        />
                                    </div>


                                    <div className={"col-span-3 m-2"}>
                                        {/* <b>Ngày sinh:</b> <span className={"text-text-color"}>26/12/2002</span>  */}
                                        <TimePickerCustom label="Ngày tháng năm sinh" initialValue={new Date()} name={"DOB"} type={"DatePicker"} onChange={
                                            (value)=>{
                                                console.log(value);
                                            }
                                        } />
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        {/* <b>Email:</b> <span className={"text-text-color"}>mintduc2612@gmail.com</span>  */}
                                        <InputCustom
                                            id="email" 
                                            label={"Email"} 
                                            name={"email"}
                                            value={formik.values.email} 
                                            isError={formik.touched.email && Boolean(formik.errors.email)} 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            errorMessage={formik.touched.email && formik.errors.email} 
                                        />
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <InputCustom
                                            id="phone" 
                                            label={"Số điện thoại"} 
                                            name={"phone"}
                                            value={formik.values.phone} 
                                            isError={formik.touched.phone && Boolean(formik.errors.phone)} 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            errorMessage={formik.touched.phone && formik.errors.phone} 
                                        />
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                    <InputSelectCustom
                                        id={"role"}
                                        name={"role"}
                                        value={roleValue}
                                        placeholder="Vai trò"
                                        label="Vai trò"
                                        onChange={(value:any) => {
                                            setRoleValue(value.target.value);
                                        } } 
                                        onBlur={undefined}
                                    >
                                        <MenuItem value={"USER"}>Tài khoản</MenuItem>
                                        <MenuItem value={"STUDENT"}>Sinh viên</MenuItem>
                                        <MenuItem value={"TEACHER"}>Giảng viên</MenuItem>
                                        <MenuItem value={"ADMIN"}>Quản trị viên</MenuItem>
                                    </InputSelectCustom>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mb-8">
                                <h2 className={"font-bold text-primary-blue text-xl"}>
                                    Thông tin sinh viên
                                </h2>

                                <div className={"grid grid-cols-9 mt-2"}>
                                    <div className={"col-span-3 m-2"}>
                                        <InputCustom
                                            id="student_code" 
                                            label={"Mã sinh viên"} 
                                            name={"student_code"}
                                            value={formik.values.student_code} 
                                            isError={formik.touched.student_code && Boolean(formik.errors.student_code)} 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            errorMessage={formik.touched.student_code && formik.errors.student_code} 
                                        />
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <InputSelectCustom
                                            id={"major"}
                                            name={"major"}
                                            value={majorValue}
                                            placeholder="Chuyên ngành"
                                            label="Chuyên ngành"
                                            onChange={(value:any) => {
                                                setMajorValue(value.target.value);
                                            } } 
                                            onBlur={undefined}
                                        >
                                            <MenuItem value={"0"}>Công nghệ phần mềm</MenuItem>
                                            <MenuItem value={"1"}>Trí tuệ nhân tạo</MenuItem>
                                            <MenuItem value={"2"}>Phát triển game</MenuItem>
                                            <MenuItem value={"3"}>Khai phá dữ liệu</MenuItem>
                                        </InputSelectCustom>
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <InputSelectCustom
                                            id={"status_project"}
                                            name={"status_project"}
                                            value={statusProjectValue}
                                            placeholder="Trạng thái đồ án"
                                            label="Trạng thái đồ án"
                                            onChange={(value:any) => {
                                                setStatusProjectValue(value.target.value);
                                            } } 
                                            onBlur={undefined}
                                        >
                                            <MenuItem value={"0"}>Bảo lưu</MenuItem>
                                            <MenuItem value={"1"}>Đang làm đồ án</MenuItem>
                                            <MenuItem value={"2"}>Đã bảo vệ</MenuItem>
                                            <MenuItem value={"3"}>Chưa bảo vệ</MenuItem>
                                        </InputSelectCustom>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end px-2">
                                <Button
                                    component="label"
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<Pencil />}
                                    >
                                        Cập nhật
                                    {/* <VisuallyHiddenInput type="file" /> */}
                                </Button>
                            </div>
                        </div>
                </form>
            </>
        </BoxWrapper>
    </> );
}

export default ProfileInput;