import Add from "@mui/icons-material/Add";
import { Avatar, Button, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, useGridApiRef, viVN } from "@mui/x-data-grid";
import { ChevronLeft, Pencil, PrinterCheck, Send } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import images from "~/assets";
import BoxWrapper from "~/components/BoxWrap";
import ItemCommentOutline from "~/components/CommentOutline/item";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import LoadingData from "~/components/LoadingData";
import ExpandableCell from "~/components/TableEdit.tsx/ExpandableCell";
import CustomEditComponent from "~/components/TableEdit.tsx/TextLines";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { addCommentOutline, checkPermission, deleteCommentOutline, getListCommentOutline, updateCommentOutline } from "~/services/commentOutlineApi";
import { getFileWordOutline, getProjectOutline } from "~/services/projectOutlineApi";
import { getListScheduleSemester } from "~/services/scheduleSemesterApi";
import { getFileAvatar } from "~/services/userApi";
import { ICommentType } from "~/types/IComment";
import { IProjectOutline } from "~/types/IProjectOutline";
import { IResponse } from "~/types/IResponse";
import { IScheduleSemester } from "~/types/IScheduleSemester";
import { formatDateTypeDateOnly, isCurrentTimeInRange } from "~/ultis/common";

function OutlinePage() {
    const navigate = useNavigate();
    const currentUser = useAppSelector(inforUser)
    const {id} = useParams();
    const [rows,setRows] = useState<any>([]);
    const [allowComment,setAllowComment] = useState(false)
    const [commentText,setCommentText] = useState("")
    const [avatar,setAvatar] = useState<any>()
    const [lstComment,setLstComment] = useState<ICommentType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading,setLoading] = useState(true);
    const [data,setData]= useState<IProjectOutline>();
    const apiRef = useGridApiRef();
    const [isUpdateOutline,setIsUpdateOutline] = useState(false);
    const columns: GridColDef[] = [
        {
            field: 'stt',
            headerName: 'STT',
            type: 'text',
            width: 50,
            editable: false,
        },
        {
          field: 'content',
          headerName: 'Nội dung công việc',
          width: 300,
          align: 'left',
          headerAlign: 'left',
          editable: false,
          renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
          renderEditCell: (props) => <><CustomEditComponent {...props} />
        </>
        },
        {
          field: 'fromDate',
          headerName: 'Từ ngày',
          type: 'text',
          width: 250,
          editable: false,
          renderCell:({row}) => {
            return <>{formatDateTypeDateOnly(row?.fromDate)}</>
            }
        },
        {
            field: 'toDate',
            headerName: 'Đến ngày',
            type: 'text',
            width: 250,
            editable: false,
            renderCell:({row}) => {
                return <>{formatDateTypeDateOnly(row?.toDate)}</>
            }
        },
        {
            field: 'note',
            headerName: 'Ghi chú',
            width: 250,
            align: 'left',
            headerAlign: 'left',
            editable: false,
            renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
            renderEditCell: (props) => <><CustomEditComponent {...props} />
          </>
        },
    ];
    
    useEffect(()=>{
    if(id){
        setLoading(true)
        getProjectOutline(id)
        .then((res:IResponse<IProjectOutline>)=>{
            
            if(res.success && res.returnObj){
                let resData = res.returnObj;
                if(res.returnObj.contentProject){
                    resData = {
                        ...resData,
                        contentProject: JSON.parse(res.returnObj.contentProject)
                    }
                }

                if(res.returnObj.expectResult){

                    resData = {
                        ...resData,
                        expectResult: JSON.parse(res.returnObj.expectResult)
                    }

                }

                if(res.returnObj.techProject){
                    resData = {
                        ...resData,
                        techProject: JSON.parse(res.returnObj.techProject)
                    }
                }
                console.log(resData)
                setData({
                    ...resData,
                    semesterId: resData?.userNameNavigation?.semesterId
                });
                if(res.returnObj.plantOutline){
                    const plant = JSON.parse(res.returnObj.plantOutline);
                    console.log(plant)
                    setRows(plant)
                    setTotal(plant.length)
                }
                if(currentUser?.userName && res.returnObj?.userNameNavigation?.semesterId){
                    checkPermission(id, currentUser?.userName, res.returnObj?.userNameNavigation?.semesterId)
                    .then((res:IResponse<any>)=>{
                        if(res.success){
                            setAllowComment(true);
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }
            }
        })
        .catch(()=>{
            setLoading(true)
        })
        .finally(()=>{
            setLoading(false)
        })

        getListCommentOutline(id)
        .then((res:IResponse<ICommentType[]>)=>{
            if(res.success && res.returnObj.length > 0){
                setLstComment(res.returnObj);
            }
        })
        .catch(()=>{
            setLoading(true)
        })
        .finally(()=>{
            setLoading(false)
        })

        callCheckScheduleSemester()

        fetchApiAvatar();

    }

    },[])

    const handleCreateProjectOutline = ()=>{
        navigate("/outline/input")
    }

    const handleDeleteComment = (id:string)=>{
        if(id){
            deleteCommentOutline(id)
            .then((res:IResponse<any>)=>{
                if(res.success){
                    toast.success(res.msg);
                    setLstComment(lstComment.filter((item)=>item.commentId != id))
                }else{
                    toast.error(res.msg);
                }
            })
        }
    }

    const handleAddComment = () =>{
        if(id && currentUser?.userName && commentText.length > 0){
            const req: ICommentType = {
                contentComment: commentText,
                createdBy: currentUser?.userName,
                userName: id
            }
            addCommentOutline(req)
            .then((res:IResponse<ICommentType>)=>{
                if(res.success && res.returnObj){
                    setLstComment([res.returnObj,...lstComment])
                    setCommentText("")
                    toast.success(res.msg)
                }
            })
        }else{
            toast.warn("Thông tin không hợp lệ")
        }
    }

    const fetchApiAvatar = ()=>{
        getFileAvatar("TEACHER",currentUser?.userName)
        .then((response:any)=>{
            const blob = response.data;
            const imgUrl = URL.createObjectURL(blob);
            setAvatar(imgUrl);
        })
    }

    const handleUpdateComment = async (req: ICommentType)=>{
        try {
            const res = await updateCommentOutline(req);
            if(res.success && res.returnObj){
                toast.success(res.msg)
                return res.returnObj
            }else{
                toast.error(res.msg)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const callCheckScheduleSemester = () =>{
        if(data?.semesterId){
            getListScheduleSemester(data?.semesterId)
            .then((res: IResponse<IScheduleSemester[]>)=>{
                if(res.success){
                    const scheduleList = res.returnObj;
                    if(scheduleList.length > 0){
                        const schduleScore = scheduleList.find(item => item?.typeSchedule === "SCHEDULE_FOR_OUTLINE");
    
                        if(schduleScore){
                            const check = isCurrentTimeInRange(new Date(schduleScore?.fromDate || ""),new Date(schduleScore?.toDate || ""))
    
                            if(check === 0){
                                setIsUpdateOutline(true);
                            }else{
                                setIsUpdateOutline(false);
                            }
                        }
                    }
                }
            })
        }
    }

    return ( <>
    {
        loading ? 
        <LoadingData />
        :
        <>
            <HeaderPageTitle pageName="Đề cương đồ án"/>
            <div className="grid gap-3 grid-cols-12">
                <BoxWrapper className={"col-span-9"}>
                    <div>
                        <div className="flex justify-between w-full mb-5">
                            <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                    Quay lại
                            </Button>
                            <div className="flex">
                                {
                                    data && currentUser?.userName === id && isUpdateOutline ? 
                                    <div className="flex items-center p-2 rounded-full text-3xl mx-5 hover:bg-gray-200" onClick={()=>{navigate("/outline/input/"+id)}}>
                                        <Pencil className="text-primary-blue cursor-pointer" />
                                    </div>
                                    : <></>
                                }
                                {
                                    (data?.userNameNavigation?.userNameMentor === currentUser?.userName || id === currentUser?.userName) && currentUser?.statusProject === "DOING" &&
                                    <Button onClick={()=>{
                                        getFileWordOutline(currentUser?.userName)
                                        .then((res:any)=>{
                                            if(currentUser?.userName){
                                                const link = document.createElement('a');
                                                const fileName = `DeCuong_${currentUser?.userName}.docx`;
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

                                    }} variant="contained" startIcon={<PrinterCheck />}>
                                        In
                                    </Button>
                                }
                            </div>
                        </div>
                        
                        {
                            data ? <>
                                
                                <div>
                                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                                        Giáo viên hướng dẫn
                                    </h2>
                                    {
                                        data?.userNameNavigation?.userNameMentor ? 
                                        <div className={"grid grid-cols-9 mb-5"}>
                                            <div className={"col-span-3 m-2"}>
                                                <b>Họ và tên:</b> <span className={"text-text-color"}>{data?.userNameNavigation?.userNameMentorNavigation?.fullName}</span> 
                                            </div>

                                            <div className={"col-span-3 m-2"}>
                                                <b>Số điện thoại:</b> <span className={"text-text-color"}>{data?.userNameNavigation?.userNameMentorNavigation?.phone}</span> 
                                            </div>

                                            <div className={"col-span-3 m-2"}>
                                                <b>Email:</b> <span className={"text-text-color"}>{data?.userNameNavigation?.userNameMentorNavigation?.email}</span> 
                                            </div>

                                            <div className={"col-span-3 m-2"}>
                                                <b>Chuyên ngành:</b> <span className={"text-text-color"}>{data?.userNameNavigation?.userNameMentorNavigation?.major?.majorName}</span> 
                                            </div>

                                            <div className={"col-span-3 m-2"}>
                                                <b>Học hàm:</b> <span className={"text-text-color"}>{data?.userNameNavigation?.userNameMentorNavigation?.education?.educationName}</span> 
                                            </div>
                                        </div>
                                        :
                                        <h1 className="text-2xl text-red-600">Chưa được phân giáo viên hướng dẫn</h1>
                                    }

                                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                                        Nhóm xét duyệt
                                    </h2>
                                    {
                                        data?.groupReviewOutline ? 
                                        <div className={"grid grid-cols-9 mb-5"}>
                                            {/* <div className={"col-span-3 m-2"}>
                                                <b>Mã nhóm xét duyệt:</b> <span className={"text-text-color"}>{data?.groupReviewOutline?.groupReviewOutlineId}</span> 
                                            </div> */}

                                            <div className={"col-span-3 m-2"}>
                                                <b>Tên nhóm xét duyệt:</b> <span className={"text-text-color"}>{data?.groupReviewOutline?.nameGroupReviewOutline}</span> 
                                            </div>
                                        </div>
                                        : <h1 className="text-2xl text-red-600">Chưa được phân nhóm xét duyệt</h1>
                                    }

                                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                                        Nội dung đề cương
                                    </h2>

                                    <div className={"grid grid-cols-4"}>
                                        <div className={"col-span-4 m-2"}>
                                            <b>Tên đề tài:&#160;</b>
                                            <span className={"text-text-color"}>{data?.nameProject}</span>
                                        </div>

                                        <div className={"col-span-4 m-2"}>
                                            <b>Công nghệ sử dụng:&#160;</b>
                                            <div className={"text-text-color whitespace-pre-wrap"}>{data?.techProject || <span className={"text-red-600"}>Chưa có</span>}</div> 
                                        </div>

                                        <div className={"col-span-4 m-2"}>
                                            <b>Nội dung đề tài:</b> 
                                            <br/>
                                            <span className={"text-text-color whitespace-pre-wrap"}>
                                                {data?.contentProject || <span className={"text-red-600"}>Chưa có</span>}
                                            </span></div>

                                        <div className={"col-span-4 m-2"}>
                                            <b>Các kết quả chính dự kiến đạt được:</b> 
                                            <br/>
                                            <span className={"text-text-color whitespace-pre-wrap"}>
                                                {data?.expectResult || <span className={"text-red-600"}>Chưa có</span>}
                                            </span> 
                                        </div>

                                        <div className={"col-span-4 m-2"}>
                                            <b>Kế hoạch thực hiện đề tài</b>
                                        </div>
                                        
                                    </div>
                                    <div className={"px-3"}>
                                        <DataGrid
                                            apiRef={apiRef}
                                            sx={{
                                                // disable cell selection style
                                                '.MuiDataGrid-cell:focus': {
                                                outline: 'none'
                                                },
                                                // pointer cursor on ALL rows
                                                '& .MuiDataGrid-row:hover': {
                                                cursor: 'pointer'
                                                }
                                            }}
                                            getRowHeight={() => 'auto'}
                                            loading={rows.length === 0}
                                            rows={rows}
                                            columns={columns}
                                            rowCount={total}
                                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                            onCellClick={({row})=>{

                                            }}
                                            hideFooter={true}
                                            // pageSizeOptions={[10]}
                                        />
                                    </div>
                                        
                                </div>

                            </> : <>
                            {
                                currentUser?.userName === id ? <>
                                    <div className="flex justify-center">
                                        {
                                            currentUser?.statusProject === "START" ?
                                            <Button onClick={handleCreateProjectOutline} variant="contained" startIcon={<Add />}>
                                                    Tạo đề cương đồ án
                                            </Button>
                                            :
                                            <h1 className="text-2xl">Sinh viên này không đủ điều kiện làm đồ án</h1>
                                        }
                                    </div>            
                                </> : <>
                                    <h1 className="text-2xl">Sinh viên này chưa tạo đề cương đồ án</h1>
                                </>
                            }
                            </>
                        }
                    </div>
                </BoxWrapper>
                        
                <BoxWrapper className={"col-span-3 max-h-screen overflow-hidden"}>
                    <div>
                        <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                            Nhận xét
                        </h2>
                        {
                        allowComment &&
                        <div className="box_comment mb-10 grid grid-cols-10 gap-1">
                            <div className="col-span-2">
                                <Avatar 
                                    alt="Remy Sharp" 
                                    src={avatar}  
                                    sx={{ width: 40, height: 40, marginTop:1 }}>
                                        
                                </Avatar>
                            </div>
                            <div className="col-span-7">
                                <TextField 
                                    id="comment" 
                                    label="Nhận xét đề cương" 
                                    variant="standard"
                                    value={commentText}
                                    onChange={(e)=>{
                                        setCommentText(e.target.value);
                                    }}
                                    multiline 
                                    fullWidth
                                />
                                
                            </div>
                            <div className="col-span-1 cursor-pointer flex flex-col justify-center" onClick={handleAddComment}>
                                <Send className="text-blue-600" />
                            </div>
                        </div>
                        }

                        <div className={"mt-5 max-h-screen overflow-scroll"}>
                            <ul className="flex flex-col">
                                {
                                    lstComment && lstComment.map((item)=>{
                                        return (
                                            <ItemCommentOutline handleDelete={handleDeleteComment} handleUpdate={handleUpdateComment} key={item.commentId} item={item} />
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </BoxWrapper>        
            </div>
    
        </>
    }

    </> );
}

export default OutlinePage;