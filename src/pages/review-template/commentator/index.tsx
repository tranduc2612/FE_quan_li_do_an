import Button from '@mui/material/Button';
import { ChevronLeft, Download, Pencil } from "mdi-material-ui";
import { useEffect, useState } from "react";
import {
    useNavigate
} from 'react-router-dom';
import { toast } from 'react-toastify';
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import Loading from "~/components/Loading";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { GetProjectByHashKey, IReqKeyHash, downloadFileWord } from '~/services/projectApi';
import { IProjecType } from '~/types/IProjectType';
import { IResponse } from '~/types/IResponse';
import { IStudent } from '~/types/IStudentType';

function DetailReviewCommentor() {
    const info = useAppSelector(inforUser)
    // const {id,idStudent} = useParams();
    const navigate = useNavigate();
    const [profile,setProfile] = useState<IStudent>();
    const [project,setProject] = useState<IProjecType>();
    const [loading,setLoading] = useState(false); 
    useEffect(()=>{
        setLoading(true)
        // if(){
            const reqKey: IReqKeyHash ={
                key: "FBE3394A-E02A-4252-8484-F4229A3ADE17",
                role: "COMMENTATOR"
            }
            GetProjectByHashKey(reqKey)
            .then((res:IResponse<IProjecType>)=>{
                console.log(res);
                if(res.success && res.returnObj){
                    const req = res.returnObj
                    console.log(req)
                    if(req){
                        setProject(req)
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
        // }
    },[])

    return (
    <>
        {loading ? <><Loading /></> : 
    <>
        <HeaderPageTitle pageName={"Kế hoạch đồ án"} pageChild="Chi tiết"/>
        <div className="">
            <BoxWrapper className={`mb-5`}>
                <div>
                    <div className='flex justify-between'>
                        <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                Quay lại
                        </Button>

                        <div className="flex">
                            <div className="flex items-center p-2 rounded-full text-3xl mx-2 hover:bg-gray-200" onClick={()=>{navigate("/input/review-commentator")}}>
                                <Pencil className="text-primary-blue cursor-pointer" />
                            </div>

                            <Button onClick={()=>{  
                                const req: IReqKeyHash ={
                                    key: "FBE3394A-E02A-4252-8484-F4229A3ADE17",
                                    role:"COMMENTATOR"
                                }  
                                downloadFileWord(req)
                                .then((res:any)=>{
                                    if(info?.userName){
                                        const link = document.createElement('a');
                                        const fileName = `NXGVPB_${info?.userName}.docx`;
                                        link.setAttribute('download', fileName);
                                        link.href = URL.createObjectURL(new Blob([res]));
                                        document.body.appendChild(link);
                                        link.click();
                                        link.remove();
                                    }
                                })
                                .catch((err)=>{
                                    console.log(err)
                                    toast.warning("Không hợp lệ")
                                })
                            }} variant="contained" startIcon={<Download />}>
                                Tải xuống
                            </Button>

                        </div>
                    </div>
                    <h2 className={"font-bold text-center text-primary-blue text-2xl mb-3 mt-3"}>
                        BẢN NHẬN XÉT CỦA NGƯỜI ĐỌC DUYỆT ĐỒ ÁN TỐT NGHIỆP
                    </h2>
                    

                    <div className="relative mb-8 mt-8">
                            <div className={"font-bold text-primary-blue text-xl"}>
                                Thông tin giảng viên phản biện
                            </div>

                            <div className={"grid grid-cols-9 mt-2"}>
                                <div className={"col-span-3 m-2"}>
                                    <b>Tên giảng viên:</b> <span className={"text-text-color"}>{project?.userNameCommentatorNavigation?.fullName}</span>
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Chuyên ngành:</b> <span className={"text-text-color"}>{project?.userNameCommentatorNavigation?.major?.majorName}</span>
                                </div>

                                <div className={"col-span-3 m-2"}>
                                    <b>Học vị:</b> <span className={"text-text-color"}>{project?.userNameCommentatorNavigation?.education?.educationName}</span>
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

                    <div className="mb-8 mt-8">
                        <div className={"font-bold text-primary-blue text-xl"}>
                            Đánh giá đồ án
                        </div>

                        <div className={"grid grid-cols-9 mt-2"}>
                            <div className={"col-span-9 m-2"}>
                                <b>Điểm:&#160;</b> <span className={"text-primary-blue"}>{project?.scoreCommentator}</span>
                            </div>

                            <div className={"col-span-9 m-2"}>
                                <b>Nhận xét:</b> 
                            </div>
                            <div className={"text-text-color col-span-9 mx-2 pe-5 overflow-hidden whitespace-pre-wrap break-words"}>
                                {project?.commentCommentator && JSON.parse(project?.commentCommentator)}
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