import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import { Button, InputLabel, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Delete, Pencil,PrinterCheck,Send } from "mdi-material-ui";
import TableCustom from "~/components/TableEdit.tsx";
import TableView from "~/components/TableView";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowModes, GridRowsProp, GridToolbarContainer, useGridApiRef, viVN } from "@mui/x-data-grid";
import CustomEditComponent from "~/components/TableEdit.tsx/TextLines";
import ExpandableCell from "~/components/TableEdit.tsx/ExpandableCell";
import { useEffect, useState } from "react";
import { IResponse } from "~/types/IResponse";
import { IProjectOutline } from "~/types/IProjectOutline";
import { getProjectOutline } from "~/services/projectOutlineApi";
import LoadingData from "~/components/LoadingData";
import Add from "@mui/icons-material/Add";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { formatDate, formatDateTypeDateOnly } from "~/ultis/common";
import images from "~/assets";
import { addCommentOutline, checkPermission, deleteCommentOutline, getListCommentOutline, updateCommentOutline } from "~/services/commentOutlineApi";
import { ICommentType } from "~/types/IComment";
import { toast } from "react-toastify";
import ItemCommentOutline from "~/components/CommentOutline/item";
function OutlinePage() {
    const navigate = useNavigate();
    const info = useAppSelector(inforUser)
    const {id} = useParams();
    const [rows,setRows] = useState<any>([]);
    const [allowComment,setAllowComment] = useState(false)
    const [commentText,setCommentText] = useState("")
    const [lstComment,setLstComment] = useState<ICommentType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading,setLoading] = useState(true);
    const [data,setData]= useState<IProjectOutline>();
    const apiRef = useGridApiRef();
    

    const columns: GridColDef[] = [
        {
            field: 'stt',
            headerName: 'STT',
            type: 'text',
            width: 50,
            editable: true,
        },
        {
          field: 'content',
          headerName: 'Nội dung công việc',
          width: 300,
          align: 'left',
          headerAlign: 'left',
          editable: true,
          renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
          renderEditCell: (props) => <><CustomEditComponent {...props} />
        </>
        },
        {
          field: 'fromDate',
          headerName: 'Từ ngày',
          type: 'text',
          width: 250,
          editable: true,
          renderCell:({row}) => {
            return <>{formatDateTypeDateOnly(row?.fromDate)}</>
            }
        },
        {
            field: 'toDate',
            headerName: 'Đến ngày',
            type: 'text',
            width: 250,
            editable: true,
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
            editable: true,
            renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
            renderEditCell: (props) => <><CustomEditComponent {...props} />
          </>
        },
    ];

    useEffect(()=>{
    if(id){
        getProjectOutline(id)
        .then((res:IResponse<IProjectOutline>)=>{
            if(res.success && res.returnObj){
                setData(res.returnObj);
                if(res.returnObj.plantOutline){
                    const plant = JSON.parse(res.returnObj.plantOutline);
                    console.log(plant)
                    setRows(plant)
                    setTotal(plant.length)
                }
                if(info?.userName && res.returnObj?.userNameNavigation?.semesterId){
                    checkPermission(id, info?.userName, res.returnObj?.userNameNavigation?.semesterId)
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
        if(id && info?.userName && commentText.length > 0){
            const req: ICommentType = {
                contentComment: commentText,
                createdBy: info?.userName,
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

    return ( <>
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
                                data && info?.userName === id ? 
                                <div className="flex items-center p-2 rounded-full text-3xl mx-5 hover:bg-gray-200" onClick={()=>{navigate("/outline/input/"+id)}}>
                                    <Pencil className="text-primary-blue cursor-pointer" />
                                </div>
                                
                                : <></>
                            }
                            
                            {
                                data?.userNameNavigation?.userNameMentor === info?.userName || id === info?.userName &&
                                <Button onClick={()=>{navigate(-1)}} variant="contained" startIcon={<PrinterCheck />}>
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
                                        <b>Học hàm:</b> <span className={"text-text-color"}>{data?.userNameNavigation?.userNameMentorNavigation?.education}</span> 
                                    </div>
                                </div>

                                <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                                    Nhóm xét duyệt
                                </h2>
                                <div className={"grid grid-cols-9 mb-5"}>
                                    <div className={"col-span-3 m-2"}>
                                        <b>Mã nhóm xét duyệt:</b> <span className={"text-text-color"}>{data?.groupReviewOutline?.groupReviewOutlineId}</span> 
                                    </div>

                                    <div className={"col-span-3 m-2"}>
                                        <b>Tên nhóm xét duyệt:</b> <span className={"text-text-color"}>{data?.groupReviewOutline?.nameGroupReviewOutline}</span> 
                                    </div>
                                </div>

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
                                        <span className={"text-text-color whitespace-pre-wrap"}>{data?.techProject}</span> 
                                    </div>

                                    <div className={"col-span-4 m-2"}>
                                        <b>Nội dung đề tài:</b> 
                                        <br/>
                                        <span className={"text-text-color whitespace-pre-wrap"}>
                                            {data?.contentProject}
                                        </span></div>

                                    <div className={"col-span-4 m-2"}>
                                        <b>Các kết quả chính dự kiến đạt được:</b> 
                                        <br/>
                                        <span className={"text-text-color whitespace-pre-wrap"}>
                                            {data?.expectResult}
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
                            info?.userName === id ? <>
                                <div className="flex justify-center">
                                    <Button onClick={handleCreateProjectOutline} variant="contained" startIcon={<Add />}>
                                            Tạo đề cương đồ án
                                    </Button>
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
                        Nhận xét nhóm xét duyệt
                    </h2>
                    {
                    allowComment &&
                    <div className="box_comment mb-10 grid grid-cols-10 gap-1">
                        <img src={images.image.anh_demo} className={`col-span-2 rounded-full w-10 h-10 object-cover`} />
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

    </> );
}

export default OutlinePage;