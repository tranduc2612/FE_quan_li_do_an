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
import { DataGrid, GridColDef, GridPaginationModel, GridRowParams, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useNavigate, useParams } from 'react-router-dom';
import ModalCustom from "~/components/Modal";
import { toast } from "react-toastify";
import { ITeacher } from "~/types/ITeacherType";
import { deleteTeacher, getListTeacher } from "~/services/teacherApi";
// import RegisterTeacher from "./input";
import BoxWrapper from "~/components/BoxWrap";
import { AssignGroupReviewTeaching, addGroupReview, assginGroupReviewToTeaching, deleteGroupReview, getListReviewOutline, getListReviewOutlineSemester, getListTeachingSemester, updateGroupReview } from "~/services/groupReviewOutlineApi";
import { IGroupReviewOutline } from "~/types/IGroupReviewOutline";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import { formatDateTypeDateOnly } from "~/ultis/common";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import Edit from "@mui/icons-material/Edit";
import { ITeaching } from "~/types/ITeachingType";
import { randomId } from "@mui/x-data-grid-generator";


const validationSchema = yup.object({
    groupReviewOutlineId: yup
      .string()
      .required('Mã nhóm xét duyệt'),
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
        groupReviewOutlineId: "",
        nameGroupReviewOutline: "",
        createdBy: "",
        isDelete: 0,
        createdDate: new Date()
    });
    const [totalTeacher, setTotalTeacher] = useState(0);
    const apiRefTeacher = useGridApiRef();
    const [toggleAutoAssign,setToggleAutoAssign] = useState(false);
    const [openModalInput,setOpenModalInput] = useState(false);
    const [openModalAssign,setOpenModalAssign] = useState(false);
    const [rowsTeacher,setRowsTeacher] = useState<any>([]);
    const [rowsTeacherChecked,setRowsTeacherChecked] = useState<any>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
        pageMax: -1
    });
    const [paginationModelTeacher, setPaginationModelTeacher] = useState({
        pageSize: 5,
        page: 0,
        pageMax:-1
    });
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
            editable: true,
        },
        
        {
            field: 'groupReviewOutlineId',
            headerName: 'Mã nhóm',
            width: 120,
            editable: true,
        },
        {
            field: 'nameGroupReviewOutline',
            headerName: 'Tên nhóm',
            width: 200,
            editable: true,
        },
        {
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 200,
            editable: true,
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
            editable: true,
        },
        {
            field: 'slsv',
            headerName: 'Số lượng đề cương',
            width: 200,
            editable: true
        },
        {
            field: 'action',
            headerName: 'Chức năng',
            width: 100,
            editable: true,
            renderCell:({row})=>{
                return <>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-blue-500" onClick={(e)=>{
                            setOpenModalAssign(true);
                            setGroupSelected(row)
                    }}>
                        <Tooltip title="Thêm giảng viên vào nhóm">
                            <PersonAddIcon />
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
            field: 'teacherCode',
            headerName: 'Mã sinh viên',
            width: 120,
            editable: true,
        },
        {
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 350,
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
            headerName: 'Học vấn',
            width: 160,
            editable: true,
        },
        {
            field: 'groupReviewOutlineId',
            headerName: 'Mã nhóm xét duyệt',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                console.log(row)
                return <>{row?.groupReviewOutline  ? row?.groupReviewOutlineId : "Chưa được gán"}</>
            }
        },
        {
            field: 'nameGroupReviewOutline',
            headerName: 'Tên nhóm xét duyệt',
            width: 160,
            editable: true,
        },
    ]
    useEffect(()=>{
        hanleFetchApi();
    },[])

    useEffect(()=>{
        handleFetchApiTeacherList()
    },[groupSelected.groupReviewOutlineId])

    const hanleFetchApi = async () => {
        const idSemester = id;
        await getListReviewOutlineSemester({
            semesterId: idSemester,
            groupReviewOutlineId: formik.values.groupReviewOutlineId,
            nameGroupReviewOutline: formik.values.nameGroupReviewOutline
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
        await getListTeachingSemester({
            pageSize: paginationModelTeacher.pageSize,
            pageIndex:  paginationModelTeacher.page + 1,
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
                          id: index+1,
                          ...data,
                          ...data?.groupReviewOutline,
                          ...data?.semester,
                          ...data?.userNameTeacherNavigation
                        }
                    })
                    console.log(newMap,"sadkaksdkasd")
                    const totalItem = newMap.length;
                    setTotalTeacher(totalItem)
                    setRowsTeacher([...newMap])
                    const checked = newMap.filter((item:any,index:any)=>item.groupReviewOutlineId == groupSelected?.groupReviewOutlineId).map((r,index) => index+1)
                    setRowsTeacherChecked([...checked])
                }
              }
        })
        .finally(()=>{
            setLoadingData(false)
        })
    }

    const formik = useFormik({
        initialValues: initialData,
        onSubmit: (values) => {
          console.log(values);
        },
    });

    const formikInput = useFormik({
        initialValues: {
            groupReviewOutlineId: "",
            nameGroupReviewOutline: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values,{ setSubmitting, setErrors, setStatus }) => {
          console.log(values);
          const req: IGroupReviewOutline = {
            groupReviewOutlineId: values.groupReviewOutlineId,
            nameGroupReviewOutline: values.nameGroupReviewOutline,
            createdBy:info?.userName
          }
          addGroupReview(req)
            .then((res:IResponse<any>)=>{
                if(res.success){
                    setOpenModalInput(false)
                    formikInput.resetForm();
                    setPaginationModel({
                        page: 0,
                        pageSize: 5,
                        pageMax: -1
                    })
                    toast.success(res.msg)
                }else{
                    setErrors({ groupReviewOutlineId: res.msg})
                }
            })
        },
    });

    const handlePaginationModelChangeTeacher = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModelTeacher({
            ...paginationModelTeacher,
            page:newPaginationModel.page
        })
    };

    const handleOpen = () => setOpenModalDelete(true);
    const handleClose = () => setOpenModalDelete(false);

    const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModel({
            ...paginationModel,
            page:newPaginationModel.page
        })
    };

    const hanleDeleteGroup = ()=>{
        const idSelect = apiRef.current.getSelectedRows();
        console.log(idSelect)
        // deleteGroupReview(groupSelected.groupReviewOutlineId || "")
        // .then((res:any)=>{
        //     console.log(res);
        //     if(res.success){
        //         toast.success(res.msg)
        //         setPaginationModel({
        //             page: 0,
        //             pageSize: 10,
        //             pageMax: -1
        //         })
        //     }else{
        //         toast.error(res.msg)
        //     }
        // })
        // .catch((err:any)=>{
        //     console.log(err)
        //     // toast.error(err)
        // })
    }

    return (
            <div className="p-4 overflow-scroll max-h-screen">
                    { <div>
                        {/* Form tìm kiếm */}
                        {
                            <form action="" onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-12 gap-4">

                                    <div className="col-span-6">
                                        <TextField
                                            onChange={formik.handleChange}
                                            value={formik.values.groupReviewOutlineId} 
                                            id="groupReviewOutlineId" 
                                            label="Mã nhóm"
                                            name="groupReviewOutlineId"
                                            variant="outlined"
                                            fullWidth 
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <TextField
                                            onChange={formik.handleChange} 
                                            value={formik.values.nameGroupReviewOutline} 
                                            id="nameGroupReviewOutline" 
                                            label="Tên nhóm"
                                            name="nameGroupReviewOutline"
                                            variant="outlined"
                                            fullWidth 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-5">
                                    <div className="flex">
                                        <div className="me-2">
                                            <Button type="submit" variant="outlined" startIcon={<SearchIcon />}
                                                onClick={()=>{
                                                    hanleFetchApi()
                                                }}
                                            >
                                                Tìm kiếm
                                            </Button>
                                        </div>
                                        <div>
                                            <Button variant="text" onClick={()=>{
                                                formik.resetForm()
                                            }}>
                                                <RefreshIcon />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <Button variant="contained" startIcon={<CalculateIcon />} onClick={()=>{
                                            setToggleAutoAssign(!toggleAutoAssign)
                                        }}>
                                        {
                                            toggleAutoAssign ? "Gán tay" : "Tự động chia giảng viên"
                                        }
                                            
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        }

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
                                rowCount={total}
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                onPaginationModelChange={handlePaginationModelChange}
                                onCellClick={({row})=>{
                                }}
                                initialState={{
                                pagination: {
                                    paginationModel: { page: paginationModel.page, pageSize: paginationModel.pageSize },
                                },
                                }}
                                pageSizeOptions={[10]}
                            />
                        </div>
                    </div>
                    }
                    

                    <Modal
                        open={openModalInput}
                        onClose={()=>setOpenModalInput(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                                    Thêm mới nhóm xét duyệt
                                </h2>
                                <form method="dialog" onSubmit={formikInput.handleSubmit}>
                                    <div className="">
                                        <div className="my-5">
                                            <InputCustom
                                                id={"groupReviewOutlineId"}
                                                label="Mã phòng xét duyệt"
                                                name={"groupReviewOutlineId"}
                                                value={formikInput.values.groupReviewOutlineId} 
                                                onChange={formikInput.handleChange}
                                                onBlur={formikInput.handleBlur}
                                                isError={formikInput.touched.groupReviewOutlineId && Boolean(formikInput.errors.groupReviewOutlineId)} 
                                                errorMessage={formikInput.touched.groupReviewOutlineId && formikInput.errors.groupReviewOutlineId} 
                                            />
                                        </div>

                                        <div className="my-5">
                                            <InputCustom
                                                id={"nameGroupReviewOutline"}
                                                label="Tên phòng xét duyệt"
                                                name={"nameGroupReviewOutline"}
                                                value={formikInput.values.nameGroupReviewOutline} 
                                                onChange={formikInput.handleChange}
                                                onBlur={formikInput.handleBlur}
                                                isError={formikInput.touched.nameGroupReviewOutline && Boolean(formikInput.errors.nameGroupReviewOutline)} 
                                                errorMessage={formikInput.touched.nameGroupReviewOutline && formikInput.errors.nameGroupReviewOutline} 
                                            />
                                        </div>
                                    </div>
                                    <div className="float-end">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn bg-slate-900 text-[#fff] hover:bg-white hover:text-slate-900 btn-outline me-4" onClick={()=>{
                                            setOpenModalInput(false);
                                            formikInput.resetForm();
                                        }}>
                                            Đóng
                                        </button>
                                        <button 
                                            className={`btn btn-outline  text-[#fff] hover:bg-white hover:border-primary-blue bg-primary-blue hover:text-primary-blue`}
                                            onClick={()=>{
                                            }}>
                                                Thêm mới
                                        </button>
                                    </div>
                                </form>
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
                            
                            <div>
                                <div className="grid grid-cols-12">
                                    <div className="col-span-6">
                                        <TextField 
                                            id="outlined-basic" 
                                            label="Tên giáo viên hướng dẫn" 
                                            variant="outlined"
                                            value={valueSearchTeacher} 
                                            onChange={(e)=>{
                                                setValueSearchTeacher(e.target.value)
                                            }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button variant="outlined" onClick={
                                        ()=>{
                                            handleFetchApiTeacherList()
                                        }
                                    }>Tìm kiếm</Button>
                                    <Button variant="text" onClick={()=>{
                                        setValueSearchTeacher("");
                                    }}>
                                        <RefreshIcon />
                                    </Button>
                                </div>
                                
                            </div>

                            <div className="mt-5">
                                {
                                    loadingData ? <LoadingData /> : 
                                    <DataGrid
                                    apiRef={apiRefTeacher}
                                    rows={rowsTeacher}
                                    loading={loadingData}
                                    columns={columnsTeacher}
                                    rowCount={totalTeacher}
                                    checkboxSelection={true}
                                    isRowSelectable={(params: GridRowParams) => params.row?.groupReviewOutlineId == groupSelected?.groupReviewOutlineId || !params.row?.groupReviewOutlineId}
                                    rowSelectionModel={rowsTeacherChecked}
                                    onRowSelectionModelChange={setRowsTeacherChecked}
                                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                    onPaginationModelChange={handlePaginationModelChangeTeacher}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                page: paginationModelTeacher.page, 
                                                pageSize: paginationModelTeacher.pageSize 
                                            },
                                        },
                                    }}
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