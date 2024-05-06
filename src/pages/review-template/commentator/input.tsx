import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { Check, ChevronLeft } from "mdi-material-ui";
import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import InputCustom from '~/components/InputCustom';
import Loading from "~/components/Loading";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { GetProjectByHashKey, IReqKeyHash, ScoreType, updateScore } from '~/services/projectApi';
import { getListScheduleSemester } from '~/services/scheduleSemesterApi';
import { IProject } from '~/types/IProjectType';
import { IResponse } from '~/types/IResponse';
import { IScheduleSemester } from '~/types/IScheduleSemester';
import { IStudent } from '~/types/IStudentType';
import { roundedNumber } from '~/ultis/common';

const validationSchema = yup.object({
    comment: yup
      .string()
      .required('Đánh giá không được để trống'),
    score: yup
      .string()
      .required('Điểm không được để trống')
      .matches(/^(10(\,0+)?|[0-9](\,[0-9]+)?)$/, "Điểm không hợp lệ"),

  });

function InputReviewCommentor() {
    const info = useAppSelector(inforUser)
    const {key} = useParams();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false); 
    const [profile,setProfile] = useState<IStudent>();
    const [project,setProject] = useState<IProject>();
    const [display,setDisplay] = useState<Boolean>(false);

    const formik = useFormik({
        initialValues: {
            score:"",
            comment:"1. Bố cục và hình thức (2 điểm)\n\n2. Nội dung (3 điểm)\n3. Sản phầm đồ án (phần mềm, bài lab, …) (5 điểm)"
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            const req:ScoreType = {
                userName: profile?.userName,
                semesterId: profile?.semesterId,
                role: "COMMENTATOR",
                score: formik.values.score,
                comment: JSON.stringify(formik.values.comment)
            } 
            updateScore(req)
            .then((res:IResponse<any>)=>{
                if(res.success){
                    toast.success(res.msg);
                    navigate("/review-commentator/"+key)
                }else{
                    toast.error(res.msg)                                   
                }
            })
        },
      });
      useEffect(()=>{
        setLoading(true)
        if(key){
            const reqKey: IReqKeyHash ={
                key: key,
                role: "COMMENTATOR"
            }
            GetProjectByHashKey(reqKey)
            .then((res:IResponse<IProject>)=>{
                console.log(res);
                if(res.success && res.returnObj){
                    const req = res.returnObj
                    console.log(req)
                    if(req){
                        setProject(req)
                        formik.setValues({
                            score: req?.scoreCommentator ? roundedNumber(req?.scoreCommentator).toString()?.replace(".",",") : "",
                            comment: req?.commentCommentator ? JSON.parse(req?.commentCommentator) : "1. Bố cục và hình thức (2 điểm)\n\n2. Nội dung (3 điểm)\n3. Sản phầm đồ án (phần mềm, bài lab, …) (5 điểm)"
                        })

                        const semesterId = req?.semesterId;
                        if(semesterId){
                            getListScheduleSemester(semesterId)
                            .then((res: IResponse<IScheduleSemester[]>)=>{
                                if(res.success){
                                    const scheduleList = res.returnObj;
                                    const findSchedule = scheduleList.find(x=>x.typeSchedule === "SCHEDULE_FOR_COMMENTATOR")
                                    if(findSchedule){
                                        if(findSchedule.fromDate && findSchedule.toDate){
                                            const currentDate = new Date(); // Lấy ngày hiện tại
                                            const fromDate = new Date(findSchedule.fromDate);
                                            const toDate = new Date(findSchedule.toDate);

                                            // Kiểm tra nếu cả fromDate và toDate đều nằm trong khoảng thời gian hiện tại
                                            if (fromDate <= currentDate && currentDate <= toDate) {

                                                setDisplay(true)
                                            }else{
                                                setDisplay(false)
                                            }
                                        }
                                    }else{
                                        setDisplay(false)
                                    }
                                }
                            })
                        }
                    }
                    if(req?.userNameNavigation){
                        setProfile(req?.userNameNavigation)
                    }
                    setLoading(false)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
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
                    
                    {
                    !display ? <h2 className={"font-bold text-center text-primary-blue text-2xl mt-32"}>
                        Đã hết thời hạn nhận xét sinh viên !
                    </h2>:
                    <>
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
                                        <b>Học vị:</b> <span className={"text-text-color"}>Tiến sỹ</span>
                                    </div>
                                </div>
                        </div>

                        <div className="relative mb-8 mt-8">
                                <div className={"font-bold text-primary-blue text-xl"}>
                                    Thông tin sinh viên
                                </div>

                                <div className={"grid grid-cols-9 mt-2"}>
                                    <div className={"col-span-3 m-2"}>
                                        <b>Mã sinh viên:</b> <span className={"text-text-color"}>{profile?.studentCode}</span>
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <b>Họ và tên:</b> <span className={"text-text-color"}>{profile?.fullName}</span>
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <b>Tên đề tài:</b> <span className={"text-text-color"}>{project?.projectOutline?.nameProject}</span>
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
                                            id={"comment"}
                                            label="Nhận xét của người đọc duyệt"
                                            name={"comment"}
                                            placeholder="Nhận xét của người đọc duyệt"
                                            value={formik.values.comment}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isError={formik.touched.comment && Boolean(formik.errors.comment)}
                                            errorMessage={formik.touched.comment && formik.errors.comment}
                                            multiline={true}
                                        />
                                    </div>
                                
                                </div>
                                <div className="flex justify-end mt-10">
                                    <Button variant='contained' type="submit" startIcon={<Check />}>Lưu</Button>
                                </div>
                            </form>
                        </div>
                    
                    </>
                    }
                </div>
            </BoxWrapper>
        </div>
    </>
    }
    </>);
}

export default InputReviewCommentor;