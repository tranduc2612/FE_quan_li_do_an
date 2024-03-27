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
import { DataGrid, GridColDef, GridPaginationModel, GridRowParams, GridToolbar, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useNavigate, useParams } from 'react-router-dom';
import ModalCustom from "~/components/Modal";
import { toast } from "react-toastify";
import { ITeacher } from "~/types/ITeacherType";
import { deleteTeacher, getListTeacher } from "~/services/teacherApi";
// import RegisterTeacher from "./input";
import BoxWrapper from "~/components/BoxWrap";
import { AssignGroupReviewProjectOutline, AssignGroupReviewTeaching, addGroupReview, assginGroupReviewToProjectOutline, assginGroupReviewToTeaching, deleteGroupReview, getGroupReview, getListProjectOutlineByGroupId, getListReviewOutline, getListReviewOutlineSemester, getListTeachingSemester, updateGroupReview } from "~/services/groupReviewOutlineApi";
import { IGroupReviewOutline } from "~/types/IGroupReviewOutline";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import { formatDateTypeDateOnly } from "~/ultis/common";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import Edit from "@mui/icons-material/Edit";
import { ITeaching } from "~/types/ITeachingType";
import { randomId } from "@mui/x-data-grid-generator";
import { IProjectOutline } from "~/types/IProjectOutline";


const validationSchema = yup.object({
    groupReviewOutlineId: yup
      .string()
      .required('Mã nhóm xét duyệt'),
      nameGroupReviewOutline: yup
      .string()
      .required('Tên nhóm xét duyệt'),

  });



function GroupReviewOutlineDetail() {
    const [rows,setRows] = useState<any>([]);
    const {idGroup,idSemester} = useParams();
    const info = useAppSelector(inforUser);
    const navigate = useNavigate();
    const [groupSelected,setGroupSelected] = useState<IGroupReviewOutline>({
        groupReviewOutlineId: "",
        nameGroupReviewOutline: "",
        createdBy: "",
        isDelete: 0,
        createdDate: new Date()
    });
    const [totalStudent, setTotalStudent] = useState(0);
    const apiRefStudent = useGridApiRef();
    const [openModalInput,setOpenModalInput] = useState(false);
    const [openModalAddStudent,setOpenModalAddStudent] = useState(false);
    const [rowsStudent,setRowsStudent] = useState<any>([]);
    const [rowsStudentChecked,setRowsStudentChecked] = useState<any>([]);
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
    const [valueSearchStudent,setValueSearchStudent] = useState("");

    const apiRef = useGridApiRef();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [total, setTotal] = useState(0);
    const [loadingData,setLoadingData] = useState(false);
    const initialData = {
        userNameSearch: "",
        nameProjectSearch: "",
    }

    const formik = useFormik({
        initialValues: initialData,
        onSubmit: (values) => {
            hanleFetchApi();
        },
    });


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
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 300,
            editable: true,
        },
        {
            field: 'nameProject',
            headerName: 'Tên đề tài',
            width: 250,
            editable: true,
        },
        {
            field: 'statusProject',
            headerName: 'Trạng thái đồ án',
            width: 250,
            editable: true,
        },
        {
            field: 'userNameMentorNavigationId',
            headerName: 'Mã giảng viên hướng dẫn',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.userNameMentorNavigation ? row?.userNameMentorNavigation?.userName : <span className="text-red-600">Chưa được gán</span>}  
                </>
            }
        },
        {
            field: 'userNameMentorNavigation',
            headerName: 'Giảng viên hướng dẫn',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.userNameMentorNavigation ? row?.userNameMentorNavigation?.fullName :<></>}  
                </>
            }
        },
        
        {
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {idSemester}  
                </>
            }
        },
    ];

    const columnsProjectOutline: GridColDef[] =[
        {
            field: 'id',
            headerName: 'STT',
            width: 80,
            maxWidth: 60,
            flex: 1,
            editable: true,
        },
        {
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {idSemester}  
                </>
            }
        },
        {
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 300,
            editable: true,
        },
        {
            field: 'nameProject',
            headerName: 'Tên đề tài',
            width: 250,
            editable: true,
        },
        {
            field: 'statusProject',
            headerName: 'Trạng thái đồ án',
            width: 200,
            editable: true,
        },
        {
            field: 'userNameMentorNavigationId',
            headerName: 'Mã giảng viên hướng dẫn',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.userNameMentorNavigation ? row?.userNameMentorNavigation?.userName : <span className="text-red-600">Chưa được gán</span>}  
                </>
            }
        },
        {
            field: 'userNameMentorNavigation',
            headerName: 'Giảng viên hướng dẫn',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.userNameMentorNavigation ? row?.userNameMentorNavigation?.fullName :<></>}  
                </>
            }
        },
        {
            field: 'groupReviewOutlineId',
            headerName: 'Mã nhóm xét duyệt',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.groupReviewOutline ? row?.groupReviewOutline?.groupReviewOutlineId : <span className="text-red-600">Chưa được gán</span>}  
                </>
            }
        },
        {
            field: 'groupReviewOutline',
            headerName: 'Tên nhóm xét duyệt',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.groupReviewOutline ? row?.groupReviewOutline?.nameGroupReviewOutline :<></>}  
                </>
            }
        },
        
    ]
    useEffect(()=>{
        setLoadingData(true)
        Promise.all([hanleFetchApi(),handleFetchDetailGroup(),handleFetchApiProjectOutlineAll()])
        .then((res)=>{
            setLoadingData(false)
        })
        .catch(()=>{

        })
        .finally(()=>{
            setLoadingData(false)

        })
    },[])

    // useEffect(()=>{
    //     handleFetchApiTeacherList()
    // },[groupSelected.groupReviewOutlineId])

    const handleFetchDetailGroup = async () =>{
        if(idGroup){
            getGroupReview(idGroup)
            .then((res)=>{
                if(res.success && res.returnObj){
                    setGroupSelected(res.returnObj)
                }
            })
            .catch(()=>{

            })
        }
    }

    const hanleFetchApi = async () => {
        console.log(idSemester)
        if(idSemester){
            await getListProjectOutlineByGroupId({
                semesterId: idSemester,
                groupReviewOutlineId: idGroup,
                nameProject: formik.values.nameProjectSearch,
                UserName: formik.values.userNameSearch
            })
            .then((res:IResponse<IProjectOutline[]>)=>{
              console.log(res)
              if(res.success && res.returnObj) {
                const dataMap = res.returnObj;
                
                if(dataMap.length <= 0) {
                    setTotal(0)
                    setRows([])
                }else{
                    const newMap = dataMap.map((data:IProjectOutline,index:any)=>{
                        return {
                          id: index+1,
                          ...data,
                          ...data?.userNameNavigation,
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
        
    }

    const handleFetchApiProjectOutlineAll = async ()=>{
        if(idSemester){
            await getListProjectOutlineByGroupId({
                semesterId: idSemester,
                groupReviewOutlineId: idGroup,
                nameProject: "",
                UserName: valueSearchStudent,
                isGetAll: 1
            })
            .then((res:IResponse<IProjectOutline[]>)=>{
              console.log(res)
              if(res.success && res.returnObj) {
                const dataMap = res.returnObj;
                
                if(dataMap.length <= 0) {
                    setTotal(0)
                    setRows([])
                }else{
                    const newMap = dataMap.map((data:IProjectOutline,index:any)=>{
                        return {
                          id: index+1,
                          ...data,
                          ...data?.userNameNavigation,
                        }
                    })
                    const totalItem = newMap.length;
                    setRowsStudent([...newMap])
                    
                    const checked = newMap.filter((item:any,index:any)=>{
                        return item?.groupReviewOutline?.groupReviewOutlineId == idGroup
                    }).map((r,index) => r.id)
                    setTotalStudent(totalItem)
                    setRowsStudentChecked([...checked])
                }
              }
            })
    }
    }

    

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

    const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModel({
            ...paginationModel,
            page:newPaginationModel.page
        })
    };

    return (
        <BoxWrapper className="">
            {loadingData ? <LoadingData /> : <>
                <div className="p-4 pt-0">
                    <div className="mb-5">
                        <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                Quay lại
                        </Button>
                    </div>
                    <h2 className={"font-bold text-primary-blue text-xl mb-4"}>
                        Chi tiết nhóm xét duyệt
                    </h2>
                    <div className={"grid grid-cols-8 mb-5"}>
                        <div className={"col-span-8 my-1"}>
                            <b>Mã phòng:</b> <span className={"text-text-color"}>{groupSelected?.groupReviewOutlineId}</span> 
                        </div>

                        <div className={"col-span-8 my-1"}>
                            <b>Tên phòng:</b> <span className={"text-text-color"}>{groupSelected?.nameGroupReviewOutline}</span> 
                        </div>
                    </div>
                    <div>
                        {/* Form tìm kiếm */}
                        {
                            <form action="" onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-12 gap-4">

                                    <div className="col-span-6">
                                        <TextField
                                            onChange={formik.handleChange}
                                            value={formik.values.userNameSearch} 
                                            id="userNameSearch" 
                                            label="Tên tài khoản"
                                            name="userNameSearch"
                                            variant="outlined"
                                            fullWidth 
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <TextField
                                            onChange={formik.handleChange} 
                                            value={formik.values.nameProjectSearch} 
                                            id="nameProjectSearch" 
                                            label="Tên đồ án"
                                            name="nameProjectSearch"
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
                                        <Button variant="contained" startIcon={<AddIcon />} onClick={()=>{
                                            setOpenModalAddStudent(true)
                                        }}>
                                            Thêm sinh viên vào nhóm
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
                                checkboxSelection={false}
                                rows={rows}
                                columns={columns}
                                rowCount={total}
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                onPaginationModelChange={handlePaginationModelChange}
                                onCellClick={({row})=>{
                                    const idGroup = row?.groupReviewOutlineId;
                                    if(idSemester && idGroup){
                                        navigate(`/semester/detail/group-reivew/${idSemester}/${idGroup}`);
                                    }
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
                        

                        <Modal
                            open={openModalAddStudent}
                            onClose={()=>setOpenModalAddStudent(false)}
                            aria-labelledby="modal-modal-title-mentor-assign"
                            aria-describedby="modal-modal-description-mentor-assign"
                        >
                            <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                                Thêm sinh viên vào nhóm xét duyệt
                            </h2>
                                <div className="mt-5">
                                    {
                                        loadingData ? <LoadingData /> : 
                                        <DataGrid
                                        apiRef={apiRefStudent}
                                        rows={rowsStudent}
                                        loading={loadingData}
                                        columns={columnsProjectOutline}
                                        rowCount={totalStudent}
                                        checkboxSelection={true}
                                        isRowSelectable={(params: GridRowParams) => params.row?.groupReviewOutline?.groupReviewOutlineId == idGroup || !params.row?.groupReviewOutline?.groupReviewOutlineId}
                                        rowSelectionModel={rowsStudentChecked}
                                        onRowSelectionModelChange={setRowsStudentChecked}
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
                                            setOpenModalAddStudent(false)
                                        }}
                                        >Đóng</Button>
                                    </div>
                                    <Button variant="contained" onClick={()=>{
                                        const lstUsername:string[] = [];
                                        apiRefStudent.current.getSelectedRows().forEach((item)=>{
                                            lstUsername.push(item?.userName.toString())
                                        })
                                        console.log(lstUsername)
                                        const req: AssignGroupReviewProjectOutline ={
                                            groupReviewOutlineId: groupSelected.groupReviewOutlineId,
                                            usernameProjectOutline: lstUsername,
                                            semesterTeachingId: idSemester
                                        }
                                        assginGroupReviewToProjectOutline(req)
                                        .then((res:IResponse<any>)=>{
                                            if(res.success){
                                                toast.success(res.msg)
                                                handleFetchApiProjectOutlineAll();
                                                hanleFetchApi();
                                            }else{
                                                toast.error(res.msg)
                                            }
                                        })
                                        .catch(()=>{
                                            toast.error("Lỗi mạng")
                                        })
                                        .finally(()=>{
                                            setOpenModalAddStudent(false)
                                        })
                                    }
                                }
                                >Lưu</Button>

                                    
                                </div>
                                
                            </div>
                        </Modal>
                </div>
            </>}
        </BoxWrapper>
    );
}

export default GroupReviewOutlineDetail;