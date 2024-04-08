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
import { AssignGroupReviewProjectOutline, AssignGroupReviewTeaching, addGroupReview, assginGroupReviewToProjectOutline, assginGroupReviewToTeaching, deleteGroupReview, getGroupReview, getListProjectOutlineByGroupId, getListReviewOutline, getListReviewOutlineSemester, getListTeachingGroupOutline, updateGroupReview } from "~/services/groupReviewOutlineApi";
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


function GroupReviewOutlineDetail() {
    const [lstProjectInGroup,setLstProjectInGroup] = useState<any>([]);
    const [totalLstProjectInGroup, setTotalLstProjectInGroup] = useState(0);
    const [lstProjectNotInGroup,setLstProjectNotInGroup] = useState<any>([]);
    const [totalLstProjectNotInGroup, setTotalLstProjectNotInGroup] = useState(0);

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
    const apiRefStudent = useGridApiRef();
    const [openModalInput,setOpenModalInput] = useState(false);
    const [openModalAddStudent,setOpenModalAddStudent] = useState(false);
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
            renderCell:({row})=>{
                return <>
                    {row?.nameProject ? row?.nameProject : <span className="text-red-600">Chưa đăng ký</span>}  
                </>
            }
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
                return <div onClick={(e)=>{
                    e.stopPropagation();
                    if(row?.userNameMentor){
                        navigate("/profile/"+row?.userNameMentor)
                    }
                }}>
                    {row?.userNameMentor ? row?.userNameMentor : <span className="text-red-600">Chưa được gán</span>}  
                </div>
            }
        },
        {
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.semesterId}  
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
            renderCell:({row})=>{
                return <>
                    {row?.nameProject ? row?.nameProject : <span className="text-red-600">Chưa đăng ký</span>}  
                </>
            }
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
                    {row?.userNameMentor ? row?.userNameMentor : <span className="text-red-600">Chưa được gán</span>}  
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
                    {row?.groupReviewOutline ? row?.groupReviewOutline?.nameGroupReviewOutline :<span className="text-red-600">Chưa được gán</span>}  
                </>
            }
        },
        
    ]
    useEffect(()=>{
        setLoadingData(true)
        Promise.all([hanleFetchApi(),handleFetchDetailGroup()])
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
                // groupReviewOutlineId: idGroup,
                // nameProject: formik.values.nameProjectSearch,
                // UserName: formik.values.userNameSearch
            })
            .then((res:IResponse<IProjectOutline[]>)=>{
              console.log(res)
              if(res.success && res.returnObj) {
                const dataMap = res.returnObj;
                
                if(dataMap.length <= 0) {
                    setTotalLstProjectInGroup(0)
                    setLstProjectInGroup([])
                    setLstProjectNotInGroup([])
                }else{
                    const lstInGroup = dataMap.filter(x=>x?.groupReviewOutlineId == idGroup).map((data:IProjectOutline,index:any)=>{
                        return {
                          id: index+1, 
                          ...data,
                          ...data?.userNameNavigation,
                        }
                    })
                    
                    setTotalLstProjectInGroup(lstInGroup.length)
                    setLstProjectInGroup([...lstInGroup])

                    console.log(dataMap)
                    const lstNotInGroup = dataMap.map((data:IProjectOutline,index:any)=>{
                        return {
                          id: index+1,
                          ...data,
                          ...data?.userNameNavigation,
                        }
                    }).sort(function(a:any, b:any) {
                        if (a?.groupReviewOutlineId === idGroup && b?.groupReviewOutlineId !== idGroup) {
                          return -1; // a nằm trước b
                        }
                      
                        if (a?.groupReviewOutlineId !== idGroup && b?.groupReviewOutlineId === idGroup) {
                          return 1; // b nằm trước a
                        }
                      
                        return 0; // Giữ nguyên thứ tự ban đầu
                      })
                    setTotalLstProjectNotInGroup(lstNotInGroup.length)
                    setLstProjectNotInGroup([...lstNotInGroup])

                    const checked = lstNotInGroup.filter((item:any,index:any)=>{
                        if(item?.userNameNavigation?.userNameMentor){
                            console.log(item)
                        }
                        return item?.groupReviewOutlineId == idGroup
                    }).map((r,index) => r.id)
                    setRowsStudentChecked([...checked])
                }
              }
            })
        }
         
    }

    const handleFetchApiProjectOutlineAll = async ()=>{
    //     if(idSemester){
    //         await getListProjectOutlineByGroupId({
    //             semesterId: idSemester,
    //             groupReviewOutlineId: idGroup,
    //             nameProject: "",
    //             UserName: valueSearchStudent
    //         })
    //         .then((res:IResponse<IProjectOutline[]>)=>{
    //           console.log(res)
    //           if(res.success && res.returnObj) {
    //             const dataMap = res.returnObj;
                
    //             if(dataMap.length <= 0) {
    //                 setTotal(0)
    //                 setRows([])
    //             }else{
    //                 const newMap = dataMap.map((data:IProjectOutline,index:any)=>{
    //                     return {
    //                       id: index+1,
    //                       ...data,
    //                       ...data?.userNameNavigation,
    //                       ...data?.groupReviewOutline
    //                     } 
    //                 })
    //                 const totalItem = newMap.length;
                    // setRowsStudent([...newMap].sort(function(a:any, b:any) {
                    //     if (a?.groupReviewOutlineId === idGroup && b?.groupReviewOutlineId !== idGroup) {
                    //       return -1; // a nằm trước b
                    //     }
                      
                    //     if (a?.groupReviewOutlineId !== idGroup && b?.groupReviewOutlineId === idGroup) {
                    //       return 1; // b nằm trước a
                    //     }
                      
                    //     return 0; // Giữ nguyên thứ tự ban đầu
                    //   }))
                    
    //                   setTotalStudent(totalItem)
                    //   const checked = newMap.filter((item:any,index:any)=>{
                    //       if(item?.userNameNavigation?.userNameMentor){
                    //           console.log(item)
                    //       }
                    //       return item?.groupReviewOutlineId == idGroup
                    //   }).map((r,index) => r.id)
                    // setRowsStudentChecked([...checked])
    //             }
    //           }
    //         })
    // }
    }

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
                            <b>Tên phòng:</b> <span className={"text-text-color"}>{groupSelected?.nameGroupReviewOutline}</span> 
                        </div>
                    </div>
                    <div>
                        

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
                                rows={lstProjectInGroup}
                                columns={columns}
                                // rowCount={totalLstProjectInGroup}
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                onPaginationModelChange={handlePaginationModelChange}
                                onCellClick={({row})=>{
                                    if(row?.userName){
                                        navigate("/profile/"+row?.userName)
                                    }
                                }}
                                slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                    <GridToolbarColumnsButton />
                                    <GridToolbarFilterButton  />
                                    <Button variant="text" startIcon={<AddIcon />} onClick={()=>{
                                        setOpenModalAddStudent(true)
                                    }}>
                                        Thêm sinh viên vào nhóm
                                    </Button>
                                </GridToolbarContainer></> }}
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
                                        rows={lstProjectNotInGroup}
                                        loading={loadingData}
                                        columns={columnsProjectOutline}
                                        // rowCount={totalLstProjectNotInGroup}
                                        checkboxSelection={true}
                                        isRowSelectable={(params: GridRowParams) => params.row?.groupReviewOutlineId == idGroup || !params.row?.groupReviewOutlineId}
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