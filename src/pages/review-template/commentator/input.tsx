import Button from '@mui/material/Button';
import { Check, ChevronLeft } from "mdi-material-ui";
import { useEffect, useState } from "react";
import {
    useNavigate
} from 'react-router-dom';
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import Loading from "~/components/Loading";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { IDetailScheduleWeek } from "~/types/IDetailScheduleWeek";
import { IScheduleWeek } from "~/types/IScheduleWeek";
import * as yup from 'yup';
import { useFormik } from 'formik';
import InputCustom from '~/components/InputCustom';

const validationSchema = yup.object({
    review: yup
      .string()
      .required('Họ tên không được để trống'),
    score: yup
      .string()
      .required('Điểm không được để trống')
      .matches(/^([0-3](\.\d{1,2})?|4(\.0{1,2})?|5(\.0{1,2})?)$/, 'Điểm không hợp lệ'),  

  });

function InputReviewCommentor() {
    const info = useAppSelector(inforUser)
    // const {id,idStudent} = useParams();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false); 
    const formik = useFormik({
        initialValues: {
            score:"",
            review:"1. Bố cục và hình thức (2 điểm)\n\n2. Nội dung (3 điểm)\n3. Sản phầm đồ án (phần mềm, bài lab, …) (5 điểm)"
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          console.log(values);
          alert("Hello")
        },
      });
    useEffect(()=>{

    },[])

    return (
    <>
        {loading ? <><Loading /></> : 
    <>
        <HeaderPageTitle pageName={"Kế hoạch đồ án"} pageChild="Chi tiết"/>
        <div className="">
            <BoxWrapper className={`mb-5`}>
                <div>
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                    <h2 className={"font-bold text-center text-primary-blue text-2xl mb-3 mt-3"}>
                        BẢN NHẬN XÉT CỦA NGƯỜI ĐỌC DUYỆT ĐỒ ÁN TỐT NGHIỆP
                    </h2>
                    

                    <div className="relative mb-8 mt-8">
                            <div className={"font-bold text-primary-blue text-xl"}>
                                Thông tin giảng viên hướng dẫn
                            </div>

                            <div className={"grid grid-cols-9 mt-2"}>
                                <div className={"col-span-3 m-2"}>
                                    <b>Mã giảng viên:</b> <span className={"text-text-color"}>202020</span>
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Chuyên ngành:</b> <span className={"text-text-color"}>Công nghệ phần mềm</span>
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Học vấn:</b> <span className={"text-text-color"}>Tiến sỹ</span>
                                </div>
                            </div>
                    </div>

                    <div className="relative mb-8 mt-8">
                            <div className={"font-bold text-primary-blue text-xl"}>
                                Thông tin sinh viên
                            </div>

                            <div className={"grid grid-cols-9 mt-2"}>
                                <div className={"col-span-3 m-2"}>
                                    <b>Mã sinh viên:</b> <span className={"text-text-color"}>201210096</span>
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Họ và tên:</b> <span className={"text-text-color"}>Trần Minh Đức</span>
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Tên đề tài:</b> <span className={"text-text-color"}>Quản ly sinh viên</span>
                                </div>
                            </div>
                    </div>

                    <div className="relative mt-8">
                        <div className={"font-bold text-primary-blue text-xl"}>
                            Đánh giá đồ án
                        </div>
        
                        <form onSubmit={formik.handleSubmit}>
                            <div className={"grid grid-cols-9 mt-6"}>
                            
                                <div className="col-span-9 mb-8">
                                    <InputCustom
                                        id={"score"}
                                        label="Điểm"
                                        name={"score"}
                                        value={formik.values.score}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isError={formik.touched.score && Boolean(formik.errors.score)}
                                        errorMessage={formik.touched.score && formik.errors.score}
                                    />
                                </div>
                                <div className="col-span-9">
                                    <InputCustom
                                        id={"review"}
                                        label="Nhận xét của người đọc duyệt"
                                        name={"review"}
                                        placeholder="Nhận xét của người đọc duyệt"
                                        value={formik.values.review}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isError={formik.touched.review && Boolean(formik.errors.review)}
                                        errorMessage={formik.touched.review && formik.errors.review}
                                        multiline={true}
                                    />
                                </div>
                            
                            </div>
                            <div className="flex justify-end mt-10">
                                <Button variant='contained' type="submit" startIcon={<Check />}>Lưu</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </BoxWrapper>
        </div>
    </>
    }
    </>);
}

export default InputReviewCommentor;