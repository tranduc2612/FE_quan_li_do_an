import Button from '@mui/material/Button';
import { ChevronLeft } from "mdi-material-ui";
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

function DetailReviewCommentor() {
    const info = useAppSelector(inforUser)
    // const {id,idStudent} = useParams();
    const navigate = useNavigate();
    const [data,setData] = useState<IScheduleWeek>();
    const [detail,setDetail] = useState<IDetailScheduleWeek>();
    const [loading,setLoading] = useState(false); 
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
                                Thông tin giảng viên phản biện
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

                    <div className="mb-8 mt-8">
                        <div className={"font-bold text-primary-blue text-xl"}>
                            Đánh giá đồ án
                        </div>

                        <div className={"grid grid-cols-9 mt-2"}>
                            <div className={"col-span-9 m-2"}>
                                <b>Điểm:&#160;</b> <span className={"text-primary-blue"}>8.0</span>
                            </div>

                            <div className={"col-span-9 m-2"}>
                                <b>Nhận xét:</b> 
                            </div>
                            <div className={"text-text-color col-span-9 mx-2 pe-5 overflow-hidden whitespace-pre-wrap break-words"}>
                            Nhận xét chung về tính ý nghĩa thực tiễn, tính cấp thiết của đồ án:
                            
                            Ý thức, thái độ của sinh viên trong quá trình thực hiện đồ án: s
                            Kết quả thực hiện đồ án (cần nhận xét cụ thể những kết quả đạt được, chưa làm được): 
 
                            </div>

                            
                        </div>
                    </div>
                </div>
            </BoxWrapper>
        </div>
    </>
    }
    </>);
}

export default DetailReviewCommentor;