import { Button, MenuItem, Modal, TextField, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import InputSelectCustom from "~/components/InputSelectCustom";
import { useEffect, useState } from "react";
import { ChevronLeft, Delete } from "mdi-material-ui";
import LoadingData from "~/components/LoadingData";
import { getListClassification } from "~/services/classificationApi";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IClassificationType } from "~/types/IClassificationType";
import { getListMajor } from "~/services/majorApi";
import { IMajorType } from "~/types/IMajorType";
import { DataGrid, GridColDef, GridPaginationModel, GridRowParams, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useNavigate, useParams } from 'react-router-dom';
import ModalCustom from "~/components/Modal";
import { toast } from "react-toastify";
import { ITeacher } from "~/types/ITeacherType";
import { deleteTeacher, getListTeacher } from "~/services/teacherApi";
// import RegisterTeacher from "./input";
import BoxWrapper from "~/components/BoxWrap";
import { AssignGroupReviewTeaching, addGroupReview, assginGroupReviewToTeaching, deleteGroupReview, getListReviewOutline, getListReviewOutlineSemester, getListTeachingGroupOutline, updateGroupReview } from "~/services/groupReviewOutlineApi";
import { IGroupReviewOutline } from "~/types/IGroupReviewOutline";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import { formatDateTypeDateOnly } from "~/ultis/common";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import Edit from "@mui/icons-material/Edit";
import { ITeaching } from "~/types/ITeachingType";
import { randomId } from "@mui/x-data-grid-generator";
import Add from "@mui/icons-material/Add";


const validationSchema = yup.object({
      nameGroupReviewOutline: yup
      .string()
      .required('Tên nhóm xét duyệt'),

  });



function GroupOutlineReview() {
    const [rows,setRows] = useState<any>([]);
    const {id} = useParams();
    const info = useAppSelector(inforUser);
    const navigate = useNavigate();
    const [groupSelected,setGroupSelected] = useState<IGroupReviewOutline>({
        groupReviewOutlineId: undefined,
        nameGroupReviewOutline: "",
        createdBy: "",
        isDelete: 0,
        createdDate: new Date()
    });
    const [totalTeacher, setTotalTeacher] = useState(0);
    const apiRefTeacher = useGridApiRef();
    const [toggleAutoAssign,setToggleAutoAssign] = useState(false);
    const [openModalInputGroup,setOpenModalInputGroup] = useState(false);
    const [openModalAssign,setOpenModalAssign] = useState(false);
    const [rowsTeacher,setRowsTeacher] = useState<any>([]);
    const [rowsTeacherChecked,setRowsTeacherChecked] = useState<any>([]);
    const [valueSearchTeacher,setValueSearchTeacher] = useState("");

    const apiRef = useGridApiRef();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [total, setTotal] = useState(0);
    const [loadingData,setLoadingData] = useState(false);
    const initialData = {
        groupReviewOutlineId: "",
        nameGroupReviewOutline: "",
    }


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'STT',
            width: 80,
            maxWidth: 60,
            flex: 1,
            editable: false,
        },
        
        {
            field: 'action',
            headerName: 'Chức năng',
            width: 200,
            editable: false,
            renderCell:({row})=>{
                return <>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-blue-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalAssign(true);
                            setGroupSelected(row)
                    }}>
                        <Tooltip title="Thêm giảng viên vào nhóm">
                            <PersonAddIcon />
                        </Tooltip>
                    </div>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-yellow-500" onClick={(e)=>{
                            e.stopPropagation();
                            setGroupSelected(row);
                            formikInputGroup.values.nameGroupReviewOutline = row?.nameGroupReviewOutline;
                            setOpenModalInputGroup(true);
                    }}>
                        <Tooltip title="Sửa nhóm xét duyệt">
                            <Edit />
                        </Tooltip>
                    </div>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-red-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalDelete(true);
                            setGroupSelected(row);
                    }}>
                        <Tooltip title="Xóa nhóm xét duyệt">
                            <Delete />
                        </Tooltip>
                    </div>
                    
                    {/* <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-red-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalDelete(true);
                            setGroupSelected(row);
                    }}>
                        <Delete />
                    </div> */}
                    
    
                </>
            }
        },
        {
            field: 'nameGroupReviewOutline',
            headerName: 'Tên nhóm',
            width: 200,
            editable: false,
        },
        {
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 200,
            editable: false,
            renderCell:({row})=>{
                return <>
                    {id}    
                </>
            }
        },
        
        {
            field: 'slgv',
            headerName: 'Số lượng giáo viên',
            width: 200,
            editable: false,
        },
        {
            field: 'slsv',
            headerName: 'Số lượng đề cương',
            width: 200,
            editable: false
        },
        {
            field: 'createdBy',
            headerName: 'Người tạo',
            width: 250,
            editable: false,
        },
        {
            field: 'createdDate',
            headerName: 'Thời gian tạo',
            width: 200,
            editable: false,
            renderCell:({row})=>{
                return <>
                    {formatDateTypeDateOnly(row?.createdDate)}
                    
    
                </>
            }
        },
    ];

    const columnsTeacher: GridColDef[] =[
        {
            field: 'id',
            headerName: 'STT',
            width: 80,
            maxWidth: 60,
            flex: 1,
            editable: true,
        },
        
        {
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 250,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            width: 200,
            editable: true,
        },
        {
            field: 'education',
            headerName: 'Học vị',
            width: 160,
            editable: true,
        },
        // {
        //     field: 'groupReviewOutlineId',
        //     headerName: 'Mã nhóm xét duyệt',
        //     width: 200,
        //     editable: true,
        //     renderCell:({row})=>{
        //         return <>{row?.groupReviewOutline  ? row?.groupReviewOutlineId : <span className="text-red-600">Chưa được gán</span>}</>
        //     }
        // },
        {
            field: 'nameGroupReviewOutline',
            headerName: 'Tên nhóm xét duyệt',
            width: 160,
            editable: true,
        },
    ]
    useEffect(()=>{
        hanleFetchApiGroupList();
    },[])

    useEffect(()=>{
        handleFetchApiTeacherList()
    },[groupSelected.groupReviewOutlineId])

    const hanleFetchApiGroupList = async () => {
        const idSemester = id;
        await getListReviewOutlineSemester({
            semesterId: idSemester
        })
        .then((res:IResponse<IGroupReviewOutline[]>)=>{
          console.log(res)
          if(res.success && res.returnObj) {
            const dataMap = res.returnObj;
            
            if(dataMap.length <= 0) {
                setTotal(0)
                setRows([])
            }else{
                const newMap = dataMap.map((data:IGroupReviewOutline,index:any)=>{
                    return {
                      id: index+1,
                      ...data,
                    }
                })
                console.log(newMap,"sadkaksdkasd")
                const totalItem = newMap.length;
                setTotal(totalItem)
                setRows([...newMap])
            }
          }
        })
        
    }

    const handleFetchApiTeacherList = async ()=>{
        const idSemester = id;
        setLoadingData(true)
        await getListTeachingGroupOutline({
            semesterId:  idSemester,
            groupReviewOutlineId: groupSelected.groupReviewOutlineId,
            userNameTeacher: valueSearchTeacher
        })
        .then((res:IResponse<ITeaching[]>)=>{
            if(res.success && res.returnObj) {
                const dataMap = res.returnObj;
                
                if(dataMap.length <= 0) {
                    setTotalTeacher(0)
                    setRowsTeacher([])
                }else{
                    const newMap = dataMap.map((data:ITeaching,index:any)=>{
                        return {
                          ...data,
                          ...data?.groupReviewOutline,
                          ...data?.semester,
                          ...data?.userNameTeacherNavigation
                        }
                    }).filter(x=>x.status === "AUTH").map((data:ITeaching,index:any)=>{
                        return {
                          id: index+1,
                          ...data,
                        }
                    })
                    const totalItem = newMap.length;
                    setTotalTeacher(totalItem)
                    setRowsTeacher([...newMap])
                    const checked = newMap.filter((item:any,index:any)=>item.groupReviewOutlineId == groupSelected?.groupReviewOutlineId).map((r,index) => r.id)
                    setRowsTeacherChecked([...checked])
                }
              }
        })
        .finally(()=>{
            setLoadingData(false)
        })
    }

    const formikInputGroup = useFormik({
        initialValues: {
            nameGroupReviewOutline: "",
            semesterId:id
        },
        validationSchema: validationSchema,
        onSubmit: (values,{ setSubmitting, setErrors, setStatus }) => {
          if(groupSelected.groupReviewOutlineId){
            const req: IGroupReviewOutline = {
                groupReviewOutlineId: groupSelected.groupReviewOutlineId,
                nameGroupReviewOutline: values.nameGroupReviewOutline,
                createdBy:info?.userName,
                semesterId: values.semesterId
              }
            updateGroupReview(req)
                .then((res:IResponse<any>)=>{
                    if(res.success){
                        setOpenModalInputGroup(false)
                        formikInputGroup.resetForm();
                        toast.success(res.msg)
                        hanleFetchApiGroupList();
                    }else{
                        setErrors({ nameGroupReviewOutline: res.msg})
                    }
                })
          }else{
            const req: IGroupReviewOutline = {
                nameGroupReviewOutline: values.nameGroupReviewOutline,
                createdBy:info?.userName,
                semesterId: values.semesterId
              }
              addGroupReview(req)
                .then((res:IResponse<any>)=>{
                    if(res.success){
                        setOpenModalInputGroup(false)
                        formikInputGroup.resetForm();
                        toast.success(res.msg)
                        hanleFetchApiGroupList();
                    }else{
                        setErrors({ nameGroupReviewOutline: res.msg})
                    }
                })
            }
          }
    });

    const hanleDeleteGroup = ()=>{
        deleteGroupReview(groupSelected.groupReviewOutlineId || "")
        .then((res:any)=>{
            console.log(res);
            if(res.success){
                toast.success(res.msg)
                hanleFetchApiGroupList()
                setOpenModalDelete(false)
            }else{
                toast.error(res.msg)
            }
        })
        .catch((err:any)=>{
            console.log(err)
        })
    }

    return (
            <div className="p-4 overflow-scroll max-h-screen">
                    { <div>

                        {/* Danh sách tìm kiếm */}
                        <div className="mt-5">
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
                                checkboxSelection={toggleAutoAssign}
                                rows={rows}
                                columns={columns}
                                // rowCount={total}
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                onCellClick={({row})=>{
                                    const idSemester = id;
                                    const idGroup = row?.groupReviewOutlineId;
                                    if(idSemester && idGroup){
                                        navigate(`/semester/detail/group-reivew/${idSemester}/${idGroup}`);
                                    }
                                }}
                                initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                                }}
                                slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                        <GridToolbarColumnsButton />
                                        <GridToolbarFilterButton  />
                                        <Button startIcon={<CalculateIcon />}>Tự động chia</Button>
                                        <Button variant='text' startIcon={<Add />} onClick={()=>{
                                            formikInputGroup.values.nameGroupReviewOutline = ""
                                            setOpenModalInputGroup(true)
                                            setGroupSelected({
                                                groupReviewOutlineId: undefined,
                                                nameGroupReviewOutline: "",
                                                createdBy: "",
                                                isDelete: 0,
                                                createdDate: new Date()
                                            })
                                        }}>
                                            Thêm mới nhóm xét duyệt
                                        </Button>
                            </GridToolbarContainer></> }}
                                slotProps={{
                                    toolbar: {
                                        printOptions: { disableToolbarButton: true },
                                        csvOptions: { disableToolbarButton: true },
                                    }}
                                }
                                pageSizeOptions={[10]}
                            />
                        </div>
                    </div>
                    }
                    

                    <Modal
                        open={openModalInputGroup}
                        onClose={()=>{
                            setGroupSelected({
                                groupReviewOutlineId: undefined,
                                nameGroupReviewOutline: "",
                                createdBy: "",
                                isDelete: 0,
                                createdDate: new Date()
                            })
                            setOpenModalInputGroup(false)
                        }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                         <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                                    {groupSelected?.groupReviewOutlineId ? "Chỉnh sửa nhóm xét duyệt" :"Thêm mới nhóm xét duyệt"}
                                </h2>
                                <form method="dialog" onSubmit={formikInputGroup.handleSubmit}>
                                    <div className="">
                                        <div className="my-5">
                                            <InputCustom
                                                id={"nameGroupReviewOutline"}
                                                label="Tên phòng xét duyệt"
                                                name={"nameGroupReviewOutline"}
                                                value={formikInputGroup.values.nameGroupReviewOutline} 
                                                onChange={formikInputGroup.handleChange}
                                                onBlur={formikInputGroup.handleBlur}
                                                isError={formikInputGroup.touched.nameGroupReviewOutline && Boolean(formikInputGroup.errors.nameGroupReviewOutline)} 
                                                errorMessage={formikInputGroup.touched.nameGroupReviewOutline && formikInputGroup.errors.nameGroupReviewOutline} 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-8">
                                        <div className="mx-2">
                                        <Button variant="outlined" onClick={()=>{
                                            setOpenModalInputGroup(false);
                                            formikInputGroup.resetForm();
                                        }}>Đóng</Button>
                                        </div>
                                        <div>
                                            <Button variant="contained" type="submit">{groupSelected?.groupReviewOutlineId ? "Chỉnh sửa" :"Thêm mới"}</Button>
                                        </div>
                                    </div>
                                </form>
                        </div>
                    </Modal>

                    

                    <Modal
                        open={openModalDelete}
                        onClose={()=>setOpenModalDelete(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="title mb-10" >
                                <div className="text-2xl text-center text-primary-blue font-bold">
                                    Thông báo xác nhận xóa nhóm xét duyệt
                                </div>
                            </div>
                            <div className={``}>
                                <div className="flex justify-center">
                                    <span className="text-xl text-center font-medium">Bạn có muốn xóa nhóm xét duyệt {groupSelected.nameGroupReviewOutline} ?</span>
                                </div>
                            </div>

                            <div className="flex justify-center mt-10">
                            {/* if there is a button in form, it will close the modal */}
                                    <div className="mx-5">
                                        <Button variant="outlined" onClick={()=>setOpenModalDelete(false)}>Đóng</Button>
                                    </div>
                                    <div>
                                        <Button variant="contained" onClick={()=>{
                                            hanleDeleteGroup();
                                        }}>Xóa</Button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    

                    <Modal
                        open={openModalAssign}
                        onClose={()=>setOpenModalAssign(false)}
                        aria-labelledby="modal-modal-title-mentor-assign"
                        aria-describedby="modal-modal-description-mentor-assign"
                    >
                        <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                            Thêm giảng viên vào nhóm xét duyệt
                        </h2>
                            <div className="mt-5">
                                {
                                    loadingData ? <LoadingData /> : 
                                    <DataGrid
                                    apiRef={apiRefTeacher}
                                    rows={rowsTeacher}
                                    loading={loadingData}
                                    columns={columnsTeacher}
                                    // rowCount={totalTeacher}
                                    checkboxSelection={true}
                                    isRowSelectable={(params: GridRowParams) => params.row?.groupReviewOutlineId == groupSelected?.groupReviewOutlineId || !params.row?.groupReviewOutlineId}
                                    rowSelectionModel={rowsTeacherChecked}
                                    onRowSelectionModelChange={setRowsTeacherChecked}
                                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                page: 0, 
                                                pageSize: 5 
                                            },
                                        },
                                    }}
                                    slots={{ toolbar: GridToolbar }}
                                    slotProps={{
                                        toolbar: {
                                            printOptions: { disableToolbarButton: true },
                                            csvOptions: { disableToolbarButton: true },
                                        }}
                                    }
                                    pageSizeOptions={[5]}
                                />
                                }
                                
                            </div>

                            <div className="mt-5 flex justify-end" >
                                <div className="mx-3">
                                    <Button variant="outlined" onClick={()=>{
                                        setOpenModalAssign(false)
                                    }}
                                    >Đóng</Button>
                                </div>
                                <Button variant="contained" onClick={()=>{
                                    const semesterId = id;
                                    const lstUsername:string[] = [];
                                    apiRefTeacher.current.getSelectedRows().forEach((item)=>{
                                        lstUsername.push(item?.userName.toString())
                                    })
                                    const req: AssignGroupReviewTeaching ={
                                        groupReviewOutlineId: groupSelected.groupReviewOutlineId,
                                        usernameTeaching: lstUsername,
                                        semesterTeachingId: semesterId 
                                    }
                                    assginGroupReviewToTeaching(req)
                                    .then((res:IResponse<any>)=>{
                                        if(res.success){
                                            toast.success(res.msg)
                                            handleFetchApiTeacherList();
                                        }else{
                                            toast.error(res.msg)
                                        }
                                    })
                                    .catch(()=>{
                                        toast.error("Lỗi mạng")
                                    })
                                    .finally(()=>{
                                        setOpenModalAssign(false)
                                    })
                                }
                            }
                            >Lưu</Button>

                                
                            </div>
                            
                        </div>
                    </Modal>
            </div>
    );
}

export default GroupOutlineReview;