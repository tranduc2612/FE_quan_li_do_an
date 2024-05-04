import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from "@mui/material";
import Button from '@mui/material/Button';
import { isNumber } from "@mui/x-data-grid/internals";
import fileDownload from 'js-file-download';
import { ChevronLeft, Delete } from "mdi-material-ui";
import { useEffect, useState } from "react";
import {
    useNavigate, useParams,
} from 'react-router-dom';
import { toast } from "react-toastify";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import Loading from "~/components/Loading";
import MiniBox from "~/components/MiniBox";
import RenderStatusApply from '~/components/RenderStatusApply';
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { handleUploadFileFinal,getListProjectByUsername, dowloadFileProjectFinal } from "~/services/projectApi";
import { getScheduleSemester } from "~/services/scheduleSemesterApi";
import { dowloadScheduleWeekDetail } from '~/services/scheduleWeekApi';
import { IProject } from '~/types/IProjectType';
import { IResponse } from "~/types/IResponse";
import { IScheduleSemester } from "~/types/IScheduleSemester";
import { dateShowNotification, isCurrentTimeInRange } from "~/ultis/common";



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function ScheduleSemester() {
    const currentUser = useAppSelector(inforUser);
    const {id} = useParams();
    const navigate = useNavigate();
    const [detail,setDetail] = useState<IScheduleSemester>();
    const [project,setProject] = useState<IProject>();
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        setLoading(true);
        if(id){
            getScheduleSemester(id)
            .then((res:IResponse<IScheduleSemester>)=>{
                console.log(res)
                if(res.returnObj && res.success){
                    setDetail(res.returnObj)
                }
                setLoading(false)
            })
        }

        if(currentUser?.role === "STUDENT"){
            handleFetApiProject();
            
        }
    },[])

    const handleFetApiProject = () =>{
        getListProjectByUsername(currentUser?.userName)
        .then((res)=>{
            if(res.success){
                setProject(res.returnObj)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }



    return (
    <>
    {loading ? <><Loading /></> : 
    
    <>
        <HeaderPageTitle pageName={"Kế hoạch đồ án"} pageChild="Chi tiết"/>
        <BoxWrapper className={"mb-5"}>
            <div>
                <div className="mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                </div>

                <div className={"flex flex-col content"}>
                    {/* <h2 className={"header font-bold text-primary-blue text-2xl"}>
                        Chi tiết nội dung của bài viết
                    </h2> */}

                    <div className="font-normal  text-base text-primary-blue">
                        {dateShowNotification(detail?.fromDate,detail?.toDate)}
                    </div>

                    <div className={"mt-8 mb-8 text-base text-text-color"} style={{
                        whiteSpace:"pre-wrap"
                    }}>
                        {
                            detail?.content
                        }
                    </div>
                        {
                            detail?.typeSchedule == "SCHEDULE_FOR_MENTOR" && currentUser?.role === "STUDENT" && currentUser?.project?.hashKeyMentor &&
                            
                            <MiniBox className="" header={<span className="text-primary-blue">Đánh giá của giảng viên hướng dẫn</span>}>
                                <div className="list_file">
                                    <div className="flex flex-col cursor-pointer ps-2 pt-4 pb-2 rounded-sm border border-gray-300">
                                            <span className="underline text-primary-blue" onClick={()=>navigate("/review-mentor/"+currentUser?.project?.hashKeyMentor)}>Bấm vào đây để xem</span>
                                    </div>
                                </div>
                            </MiniBox>
                        }

{
                        detail?.typeSchedule == "SCHEDULE_FOR_COMMENTATOR" && currentUser?.role === "STUDENT" && currentUser?.project?.hashKeyMentor &&
                            
                            <MiniBox className="" header={<span className="text-primary-blue">Đánh giá của giảng viên phản biện</span>}>
                                <div className="list_file">
                                    <div className="flex flex-col cursor-pointer ps-2 pt-4 pb-2 rounded-sm border border-gray-300">
                                            <span className="underline text-primary-blue" onClick={()=>navigate("/review-commentator/"+currentUser?.project?.hashKeyCommentator)}>Bấm vào đây để xem</span>
                                    </div>
                                </div>
                            </MiniBox>
                        }

                        {
                            detail?.typeSchedule == "SCHEDULE_FINAL_FILE" && currentUser?.role === "STUDENT" && isCurrentTimeInRange(new Date(detail?.fromDate || ""),new Date(detail?.toDate || "")) === 0  &&
                            <>
                                <div className="my-2">
                                    <span className='font-bold'>Trạng thái nộp:</span> <RenderStatusApply fromDate={detail?.fromDate?.toString()} toDate={detail?.toDate?.toString()} data={project?.nameFileFinal} />
                                </div>
                                <MiniBox className="" header={
                                    <>
                                        {true ? <>
                                            <div className="flex">
                                                <div className="mx-2">
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="outlined"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    Tải file
                                                    <VisuallyHiddenInput type="file" onChange={(event)=>{
                                                        if(event.target.files?.length){
                                                            const files = Array.from(event.target.files);
                                                            const form = new FormData();
                                                            form.append("function","U");
                                                            form.append("userName", currentUser?.userName || "");
                                                            form.append("nameFile", "");
                                                            form.append("sizeFile", "");
                                                            form.append("typeFileFinal", "");
                                                            files.forEach((file) => {
                                                                // Thêm từng tệp vào FormData
                                                                form.append("file", file);
                                                            })
                                                            
                                                            handleUploadFileFinal(form)
                                                                .then((res:any)=>{
                                                                    console.log(res)
                                                                    if(res.data.success){
                                                                        console.log("runn")
                                                                        toast.success(res.data.msg)
                                                                        handleFetApiProject();
                                                                    }else{
                                                                        toast.error(res.data.msg)
                                                                    }
                                                                })
                                                            
                                                        }
                                                        
                                                    }}/>
                                                </Button>
                                                </div>
                                                <div className="mx-2">
                                                    {
                                                        project?.nameFileFinal &&
                                                        <Button color="error" variant="outlined" startIcon={<Delete />} onClick={()=>{
                                                            const form = new FormData();
                                                            form.append("function","D");
                                                            form.append("userName", currentUser?.userName || "");
                                                            handleUploadFileFinal(form)
                                                            .then((res:any)=>{
                                                                console.log(res)
                                                                if(res.data.success){
                                                                    handleFetApiProject();
                                                                    toast.success(res.data.msg)
                                                                }else{
                                                                    toast.error(res.data.msg)
                                                                }
                                                            })
                                                        }}>Xóa</Button>
                                                    }
                                                </div>
                                            </div>
                                        </> : 
                                        <span className="text-primary-blue">Tệp đính kèm</span>
                                        }
                                    </>
                                    }>
                                    <div className="list_file">
                                            {
                                                detail ? 
                                                <div className="flex flex-col cursor-pointer ps-2 pt-4 pb-2 rounded-sm border border-gray-300" onClick={()=>{
                                                    if(currentUser?.userName === project?.userName){
                                                        dowloadFileProjectFinal(currentUser?.userName || "")
                                                        .then(response => {
                                                            // Tạo một URL đối tượng từ blob
                                                            fileDownload(response, project?.nameFileFinal || "noName.txt");
                                                        })
                                                        .catch(error => {
                                                            console.log(error)
                                                            console.error('Lỗi tải xuống file:', error);
                                                        });
                                                    }
                                                }}>
                                                    <span className="name_file mb-1 text-sm text-primary-blue font-medium">{project?.nameFileFinal}</span>
                                                    
                                                    <span className="file_size text-xs font-medium">{isNumber(Number(project?.sizeFileFinal)) ? (Number(project?.sizeFileFinal)/1024).toFixed(2) : project?.sizeFileFinal} KB</span>
                                                </div>
                                                :
                                                <span className="ms-5 text-primary-blue">Chưa có file nộp</span>
                                            }
                                        </div>
                                </MiniBox>
                            </>
                        }
                </div>
            </div>
        </BoxWrapper>
    </>
    }
    </>);
}

export default ScheduleSemester;