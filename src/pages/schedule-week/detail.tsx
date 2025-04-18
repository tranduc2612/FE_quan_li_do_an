import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Edit from "@mui/icons-material/Edit";
import { Avatar, TextField, styled } from "@mui/material";
import Button from '@mui/material/Button';
import { isNumber } from "@mui/x-data-grid/internals";
import fileDownload from 'js-file-download';
import { ChevronLeft, Delete, Pencil, Send } from "mdi-material-ui";
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
import { deleteScheduleWeek, dowloadScheduleWeekDetail, getScheduleWeek, getScheduleWeekDetail, handleScheduleWeekDetail, updateCommentScheduleWeek } from "~/services/scheduleWeekApi";
import { getFileAvatar } from "~/services/userApi";
import { IDetailScheduleWeek } from "~/types/IDetailScheduleWeek";
import { IResponse } from "~/types/IResponse";
import { IScheduleWeek } from "~/types/IScheduleWeek";
import { dateShowNotification } from "~/ultis/common";

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

function ScheduleWeekDetail() {
    const currentUser = useAppSelector(inforUser)
    const {id,idStudent} = useParams();
    const navigate = useNavigate();
    const [scheduleWeekData,setScheduleWeekData] = useState<IScheduleWeek>();
    const [file,setFile] = useState<any>();
    const [commentText,setCommentText] = useState("")
    const [openModalConfirm,setOpenModalConfirm] = useState(false);
    const [detail,setDetail] = useState<IDetailScheduleWeek>();
    const [loading,setLoading] = useState(true);
    const [avatar,setAvatar] = useState<any>()
    const [switchEdit,setSwitchEdit] = useState(false); 

    useEffect(()=>{
        setLoading(true);
        console.log(id,idStudent)
        if(id){
            getScheduleWeek(id)
            .then((res:IResponse<IScheduleWeek>)=>{
                console.log(res)
                if(res.returnObj && res.success){
                    setScheduleWeekData(res.returnObj)
                    setLoading(false)
                    fetchApiAvatar(res.returnObj?.createdBy)
                }
            })
        }

        if(idStudent && id){
            //call api lấy chi tiết lịch nộp
            getScheduleWeekDetail(idStudent,id)
            .then((res:IResponse<IDetailScheduleWeek>)=>{
                console.log(res)
                if(res.returnObj){
                    setCommentText(res.returnObj.comment || "")
                    setDetail(res.returnObj)
                }
            })
        }

        
    },[])

    const fetchApiAvatar = (username?:string)=>{
        getFileAvatar("TEACHER",username)
        .then((response:any)=>{
            const blob = response.data;
            const imgUrl = URL.createObjectURL(blob);
            console.log(imgUrl)
            setAvatar(imgUrl);
        })
    }

    return (
    <>
    {loading ? <><Loading /></> : 
    
    <>
        <HeaderPageTitle pageName={"Kế hoạch đồ án"} pageChild="Chi tiết"/>
        <div className="grid grid-cols-3 gap-2">
            <BoxWrapper className={`mb-5 ${idStudent ? "col-span-2" : "col-span-4"}`}>
                <div>
                    <div className="mb-5 flex justify-between">
                        <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                Quay lại
                        </Button>
                        {
                            scheduleWeekData?.createdBy === currentUser?.userName && 
                            <div className="flex">
                                <span className="flex items-center cursor-pointer p-2 rounded-full text-3xl me-2 hover:bg-gray-200"
                                    onClick={()=>{
                                        navigate("/schedule-week/edit/"+id)
                                    }}
                                >
                                    <Pencil className="text-primary-blue" />
                                </span>
                                <span className="flex items-center cursor-pointer p-2 rounded-full text-3xl me-2 hover:bg-gray-200"
                                    onClick={()=>{
                                        if(id){
                                            deleteScheduleWeek(id)
                                            .then((res)=>{
                                                if(res.success){
                                                    toast.success(res.msg);
                                                    navigate(-1)
                                                }else{
                                                    toast.error(res.msg)
                                                }
                                            })
                                        }
                                    }}
                                >
                                    <Delete className="text-red-600" />
                                </span>
                            </div>
                        }
                    </div>

                    <div className={"flex flex-col content"}>
                        <h2 className={"header font-bold text-primary-blue text-2xl"}>
                            {scheduleWeekData?.title}
                        </h2>

                        <div className="font-normal  text-base text-primary-blue">
                            {dateShowNotification(scheduleWeekData?.fromDate,scheduleWeekData?.toDate)}
                        </div>

                        <div className={"mt-8 mb-8 text-base text-text-color"} style={{
                            whiteSpace:"pre-wrap"
                        }}>
                            {
                                scheduleWeekData?.content
                            }
                        </div>
                        {
                            idStudent &&
                            <>
                                <div className="my-2">
                                    <span className='font-bold'>Trạng thái nộp:</span> <RenderStatusApply fromDate={scheduleWeekData?.fromDate?.toString()} toDate={scheduleWeekData?.toDate?.toString()} data={detail} />
                                </div>
                                <MiniBox className="" header={
                                    <>
                                        {currentUser?.role === "STUDENT" && idStudent && currentUser?.project?.userNameMentorNavigation?.userName === scheduleWeekData?.createdBy ? <>
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
                                                            form.append("scheduleWeekId",id || "");
                                                            form.append("userNameProject",idStudent || "");
                                                            form.append("comment", "");
                                                            form.append("nameFile", "");
                                                            form.append("sizeFile", "");
                                                            files.forEach((file) => {
                                                                // Thêm từng tệp vào FormData
                                                                form.append("file", file);
                                                            })

                                                            if(detail){
                                                                //update
                                                                form.append("function","U");
                                                            }else{
                                                                //create
                                                                form.append("function","C");
                                                            }
                                                            handleScheduleWeekDetail(form)
                                                                .then((res:any)=>{
                                                                    console.log(res)
                                                                    if(res.data.success){
                                                                        console.log("runn")
                                                                        setDetail(res.data.returnObj)
                                                                        toast.success(res.data.msg)
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
                                                        currentUser?.role === "STUDENT" && currentUser?.userName === detail?.userNameProject &&
                                                        <Button color="error" variant="outlined" startIcon={<Delete />} onClick={()=>{
                                                            const form = new FormData();
                                                            form.append("scheduleWeekId",id || "");
                                                            form.append("userNameProject",idStudent || "");
                                                            form.append("function","D");
                                                            handleScheduleWeekDetail(form)
                                                            .then((res:any)=>{
                                                                console.log(res)
                                                                if(res.data.success){
                                                                    console.log("runn")
                                                                    setDetail(res.data.returnObj)
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
                                                if(id && idStudent){
                                                    dowloadScheduleWeekDetail(idStudent,id)
                                                    .then(response => {
                                                        // Tạo một URL đối tượng từ blob
                                                        fileDownload(response, detail?.nameFile || "noName.txt");
                                                    })
                                                    .catch(error => {
                                                        console.log(error)
                                                        console.error('Lỗi tải xuống file:', error);
                                                    });
                                                }
                                            }}>
                                                <span className="name_file mb-1 text-sm text-primary-blue font-medium">{detail.nameFile}</span>
                                                
                                                <span className="file_size text-xs font-medium">{isNumber(Number(detail.sizeFile)) ? (Number(detail.sizeFile)/1024).toFixed(2) : detail.sizeFile} KB</span>
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
            {
                idStudent &&
                <BoxWrapper className={"mb-5 col-span-1"}>
                <div>
                        <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                            Nhận xét của giảng viên hướng dẫn
                        </h2>
                        {
                        <div className="box_comment mb-10 grid grid-cols-10 gap-2">
                            <Avatar 
                                alt="Remy Sharp" 
                                src={avatar}  
                                sx={{ width: 40, height: 40, marginTop: 1 }}>
                                    
                            </Avatar>
                            {/* <img src={images.image.anh_demo} className={`col-span-1 rounded-full w-10 h-10 object-cover`} /> */}
                            <div className="col-span-8">
                                {
                                    switchEdit
                                    ?
                                        <TextField 
                                            id="comment" 
                                            label="Nhận xét giảng viên hướng dẫn" 
                                            variant="standard"
                                            value={commentText}
                                            onChange={(e)=>{
                                                setCommentText(e.target.value)
                                            }}
                                            multiline 
                                            fullWidth
                                        />
                                    :
                                    <span>{detail?.comment}</span>
                                }
                            </div>
                            {
                                    switchEdit
                                    ?
                                    <>
                                        <div className="col-span-1 cursor-pointer flex flex-col justify-center" onClick={()=>{
                                            if(id && idStudent && commentText.length>0){
                                                updateCommentScheduleWeek(id,idStudent,commentText)
                                                .then((res:IResponse<IDetailScheduleWeek>)=>{
                                                    if(res.success && res.returnObj){
                                                        setCommentText(res.returnObj.comment || "")
                                                        setDetail(res.returnObj)
                                                        setSwitchEdit(false)
                                                        toast.success(res.msg)
                                                    }else{
                                                        toast.warning(res.msg)
                                                    }
                                                })
                                                .catch((err)=>{

                                                })

                                            }
                                        }}>
                                            <Send className="text-blue-600" />
                                        </div>
                                        
                                    </>
                                    :
                                    <>
                                        {
                                            currentUser?.role === "TEACHER" && currentUser?.userName === scheduleWeekData?.createdBy && 
                                            <div className="col-span-1" onClick={()=>setSwitchEdit(true)}>
                                                <Edit className="text-blue-600 cursor-pointer" />
                                            </div>
                                        }
                                    </>
                                }
                            
                        </div>
                        }
                    </div>
                </BoxWrapper>
            }
        </div>
    </>
    }
    </>);
}

export default ScheduleWeekDetail;