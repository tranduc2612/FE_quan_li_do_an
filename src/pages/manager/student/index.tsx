import { Button, MenuItem, Modal, TextField, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import InputSelectCustom from "~/components/InputSelectCustom";
import { useEffect, useState } from "react";
import { ChevronLeft, Delete,AccountEdit } from "mdi-material-ui";
import LoadingData from "~/components/LoadingData";
import {IPageProps} from "../index"
import RegisterStudent from "./input";
import { deleteStudent, getListStudent } from "~/services/studentApi";
import { getListSemester } from "~/services/semesterApi";
import { getListClassification } from "~/services/classificationApi";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IClassificationType } from "~/types/IClassificationType";
import { getListMajor } from "~/services/majorApi";
import { IMajorType } from "~/types/IMajorType";
import { DataGrid, GridColDef, GridPaginationModel, GridToolbar, GridValueGetterParams, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useNavigate } from 'react-router-dom';
import ModalCustom from "~/components/Modal";
import { toast } from "react-toastify";
import { IBaseList } from "~/types/IbaseList";
import { IStudent } from "~/types/IStudentType";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InputCustom from "~/components/InputCustom";
import { getListTeacher } from "~/services/teacherApi";
import { ITeacher } from "~/types/ITeacherType";
import { assignTeacherMentor } from "~/services/projectApi";
import BoxWrapper from "~/components/BoxWrap";




function StudentManager({setCurrentPage}:IPageProps) {
    const [rows,setRows] = useState<any>([]);
    const [rowsTeacher,setRowsTeacher] = useState<any>([]);
    const navigate = useNavigate();
    const apiRefStudent = useGridApiRef();
    const apiRefTeacher = useGridApiRef();

    const [valueSearchTeacher,setValueSearchTeacher] = useState("");
    const [userSelectStudent,setUserSelectStudent] = useState<IStudent>({
        passwordText: "",
        userName: "",
        fullName: "",
        dob: new Date(),
        phone: "",
        email: "",
        avatar: "",
        createdAt: new Date(),
        createdBy: "",
        status: "",
        studentCode: "",
        className: "",
        majorId: "",
        schoolYearName: "",
        semesterId: "",
    });
    const [userSelectTeacher,setUserSelectTeacher] = useState<ITeacher>({
        userName: "",
    });
    const [switchPageInput,setSwitchPageInput] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
        pageMax:-1
    });
    const [paginationModelTeacher, setPaginationModelTeacher] = useState({
        pageSize: 5,
        page: 0,
        pageMax:-1
    });
    // const [showModalDelete,setShowModalDelete] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalAssignMentor, setOpenModalAssignMentor] = useState(false);
    const [total, setTotal] = useState(0);
    const [totalTeacher, setTotalTeacher] = useState(0);
    const [semesterOption,setSemesterOption] = useState<ISemester[]>();
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();
    const [loading,setLoading] = useState(false);
    const initialData = {
        username: "",
        fullname:"",
        student_code: "",
        major: "",
        status:"",
        semester: "",
        className: "",
        schoolYear:""
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
            field: 'action',
            headerName: 'Thao tác',
            width: 160,
            editable: true,
            renderCell:({row})=>{
                return <div className="flex justify-between">
                    <div className="cursor-pointer p-1 hover:bg-slate-300 rounded-full text-red-500 mx-1" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalDelete(true);
                            setUserSelectStudent(row);
                    }}>
                        <Tooltip title="Xóa sinh viên">
                            <Delete />  
                        </Tooltip>
                    </div>

                    <div className="cursor-pointer p-1 hover:bg-slate-300 rounded-full text-blue-500 mx-1" onClick={(e)=>{
                            e.stopPropagation();
                            setSwitchPageInput(true);
                            setUserSelectStudent(row);
                    }}>
                        <Tooltip title="Chỉnh sửa thông tin">
                            <AccountEdit />
                        </Tooltip>
                    </div>
    
                    <div className="cursor-pointer p-1 hover:bg-slate-300 rounded-full text-yellow-500 mx-1" onClick={(e)=>{
                            e.stopPropagation();
                            navigate("/profile/"+row.userName)
                            
                    }}>
                        <Tooltip title="Chi tiết thông tin">
                            <AssignmentIndIcon />  
                        </Tooltip>
                    </div>
                </div>
            }
        },
        
        {
            field: 'studentCode',
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
            field: 'gender',
            headerName: 'Giới tính',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.gender == 1 ? "Nữ" : "Nam"}</>
            }
        },
        {
            field: 'schoolYearName',
            headerName: 'Khóa',
            width: 160,
            editable: true,
        },
        {
            field: 'className',
            headerName: 'Lớp',
            width: 160,
            editable: true,
        },
        {
            field: 'semester',
            headerName: 'Học kỳ',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.project?.semester?.nameSemester}</>
            }
        },
        {
            field: 'major',
            headerName: 'Chuyên ngành',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.majorId  ? row?.major?.majorName : <span className="text-red-600">Chưa đăng ký</span>}</>
            }
        },
        {
            field: 'userNameMentorNavigation',
            headerName: 'Giáo viên hướng dẫn',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.project?.userNameMentorNavigation  ? row?.project?.userNameMentorNavigation?.fullName : <span className="text-red-600">Chưa được gán</span>}</>
            }
        },
        {
            field: 'ss',
            headerName: 'Hội đồng phòng thi',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                console.log()
                return <span className="text-red-600">Chưa có</span>
            }
        },
        {
            field: 'userNameCommentatorNavigation',
            headerName: 'Giáo viên phản biện',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.project?.userNameCommentatorNavigation  ? row?.project?.userNameCommentatorNavigation?.fullName : <span className="text-red-600">Chưa được gán</span>}</>
            }
        },
        {
            field: 'status_project',
            headerName: 'Trạng thái làm đồ án',
            width: 160,
            editable: true,
        },
        {
            field: 'status',
            headerName: 'Trạng thái tài khoản',
            width: 160,
            editable: true,
            renderCell:({row})=>{
                return <>{
                    row?.status == "AUTH" ? <span className="text-green-600">Hoạt động</span>: <span className="text-red-600">Bị khóa</span>
                }</>
            }
        }
        
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
            field: 'isAdmin',
            headerName: 'Vai trò',
            width: 160,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.isAdmin == 1 ? "Quản trị viên" : ""}</>
            }
        },
        {
            field: 'major',
            headerName: 'Chuyên ngành',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.majorId  ? row?.major?.majorName : "Chưa đăng ký"}</>
            }
        },
        {
            field: 'userNameCommentatorNavigation',
            headerName: 'Giáo viên phản biện',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.project?.userNameCommentatorNavigation  ? row?.project?.userNameCommentatorNavigation?.fullName : "Chưa được gán"}</>
            }
        },
        {
            field: 'status',
            headerName: 'Trạng thái tài khoản',
            width: 160,
            editable: true,
        },
    ]

    useEffect(()=>{
        setLoading(true);
        Promise.all([getListSemester(
            {
                semesterId: "",
                nameSemester: ""
            }
        ),getListClassification({
            typeCode: "STATUS_SYSTEM"
        }),getListMajor({
            majorId:"",
            majorName:""
        })])
        .then((responses:IResponse<any>[]) => {
        
            const semesterRes = responses[0];
            const statusRes = responses[1];
            const majorState = responses[2];
            if(semesterRes.success && semesterRes.returnObj && semesterRes.returnObj.length > 0){
                setSemesterOption(semesterRes.returnObj);
            }

            if(statusRes.success && statusRes.returnObj && statusRes.returnObj.length > 0){
                setstatusOption([
                    ...statusRes.returnObj,
                ])
            }

            if(majorState.success && majorState.returnObj && majorState.returnObj.length > 0){
                setMajorOptions(majorState.returnObj)
            }
            setLoading(false)
        })
    },[]);

    useEffect(()=>{
        handleFetchApiTeacherList()
    },[paginationModelTeacher])

    useEffect(()=>{
        hanleFetchApiListStudent();
    },[switchPageInput,paginationModel])

    const hanleFetchApiListStudent = async () => {
        if(paginationModel.page <= paginationModel.pageMax){
            return;
        }
        await getListStudent({
            pageSize: paginationModel.pageSize,
            pageIndex:  paginationModel.page + 1,
            userName:  formik.values.username,
            fullName: formik.values.fullname,
            studentCode:  formik.values.student_code,
            majorId: formik.values.major,
            status: formik.values.status,
            semesterId: formik.values.semester,
            className:  formik.values.className,
            schoolYear: formik.values.schoolYear
        })
        .then((res:IResponse<IBaseList<IStudent>>)=>{
          console.log(res)
          if(res.success && res.returnObj && res.returnObj.listResult) {
            console.log(res.returnObj.listResult)
            const dataMap = res.returnObj.listResult;
            const newMap = dataMap.map((data:IStudent,index:any)=>{
                return {
                  id: paginationModel.pageSize * paginationModel.page + index + 1,
                  ...data,
                }
            })
            const totalItem = res.returnObj.totalItem;
            setTotal(totalItem)
            if(totalItem === 0){
                setRows([])
            }else if(paginationModel.page == 0 && paginationModel.pageMax == -1){
                apiRefStudent.current.setPage(0)
                setRows([...newMap])
            }else{
                setRows([...rows,...newMap])
            }

            setPaginationModel({
                ...paginationModel,
                pageMax: paginationModel.page
            })
          }
        })

    }

    const handleFetchApiTeacherList = async ()=>{
        if(paginationModelTeacher.page <= paginationModelTeacher.pageMax){
            return;
        }
        console.log(paginationModelTeacher.pageSize)
        await getListTeacher({
            pageSize: paginationModelTeacher.pageSize,
            pageIndex:  paginationModelTeacher.page + 1,
            fullName:  valueSearchTeacher
        })
        .then((res:IResponse<any>)=>{
          if(res.success && res.returnObj && res.returnObj.listResult) {
            console.log(res.returnObj.listResult)
            const dataMap = res.returnObj.listResult;
            const newMap = dataMap.map((data:ITeacher,index:any)=>{
                return {
                  id: paginationModelTeacher.pageSize * paginationModelTeacher.page + index + 1,
                  ...data,
                }
            })

            const totalItem = res.returnObj.totalItem;
            setTotalTeacher(totalItem)
            if(totalItem === 0){
                setRowsTeacher([])
            }else if(paginationModelTeacher.page == 0 && paginationModelTeacher.pageMax == -1){
                apiRefStudent.current.setPage(0)
                setRowsTeacher([...newMap])
            }else{
                setRowsTeacher([...rowsTeacher,...newMap])
            }

            setPaginationModelTeacher({
                ...paginationModelTeacher,
                pageMax: paginationModelTeacher.page
            })
          }
        })
    }

    const formik = useFormik({
        initialValues: initialData,
        onSubmit: (values) => {
          console.log(values);
        },
    });

    const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModel({
            ...paginationModel,
            page:newPaginationModel.page
        })
    };

    const handlePaginationModelChangeTeacher = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModelTeacher({
            ...paginationModelTeacher,
            page:newPaginationModel.page
        })
    };

    const handleOpenDelete = () => setOpenModalDelete(true);
    const handleCloseDelete = () => setOpenModalDelete(false);


    const handleOpenAssignMentor = () => setOpenModalAssignMentor(true);
    const handleCloseAssignMentor = () => setOpenModalAssignMentor(false);

    const hanleDeleteAccount = ()=>{
        const username = userSelectStudent.userName || "";
        deleteStudent(username)
        .then((res)=>{
            console.log(res);
            if(res.success){
                toast.success(res.msg)
                hanleFetchApiListStudent();
            }else{
                toast.error(res.msg)
            }
        })
        .catch((err)=>{
            console.log(err)
            // toast.error(err)
        })
    }

    return ( 
        <BoxWrapper className="max-h-full">
            <div className="p-4 overflow-scroll max-h-screen">
                {
                    switchPageInput && 
                    <div className="mb-4">
                        <Button onClick={()=>{
                            setSwitchPageInput(false)
                            setUserSelectStudent({
                                passwordText: "",
                                userName: "",
                                fullName: "",
                                dob: new Date(),
                                phone: "",
                                email: "",
                                avatar: "",
                                createdAt: new Date(),
                                createdBy: "",
                                status: "",
                                studentCode: "",
                                className: "",
                                majorId: "",
                                schoolYearName: "",
                                semesterId: "",
                            })    
                        }} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                        </Button>
                    </div>
                } 
                    <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                        {switchPageInput ? "Thêm sinh viên ": "Danh sách sinh viên "}
                    </h2>
                    {
                        switchPageInput ? <RegisterStudent switchPageInput={switchPageInput} setSwitchPageInput={setSwitchPageInput} userSelect={userSelectStudent} setUserSelect={setUserSelectStudent} /> : 
                        <div>
                            {/* Form tìm kiếm */}
                            {
                                loading ? <LoadingData /> : 
                                <form action="" onSubmit={formik.handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-3">
                                            <InputSelectCustom
                                                id={"semester"}
                                                name={"semester"}
                                                onChange={formik.handleChange}
                                                value={formik.values.semester}
                                                placeholder="Học kỳ"
                                                label="Học kỳ"
                                                onBlur={undefined}
                                            >
                                                <MenuItem value={""}>Tất cả</MenuItem>
                                                {
                                                    semesterOption && semesterOption.map(x=>{
                                                        return <MenuItem key={x.semesterId} value={x.semesterId}>{x.nameSemester}</MenuItem>
                                                    })
                                                }
                                                
                                            </InputSelectCustom>
                                        </div>

                                        <div className="col-span-3">
                                            <TextField
                                                onChange={formik.handleChange}
                                                value={formik.values.username} 
                                                id="name" 
                                                label="Tài khoản"
                                                name="username"
                                                variant="outlined"
                                                fullWidth 
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <TextField
                                                onChange={formik.handleChange} 
                                                value={formik.values.student_code} 
                                                id="student_code" 
                                                label="Mã sinh viên"
                                                name="student_code"
                                                variant="outlined"
                                                fullWidth 
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <TextField
                                                onChange={formik.handleChange} 
                                                value={formik.values.fullname} 
                                                id="fullname" 
                                                label="Họ tên"
                                                name="fullname"
                                                variant="outlined"
                                                fullWidth 
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <TextField
                                                onChange={formik.handleChange} 
                                                value={formik.values.className} 
                                                id="className" 
                                                label="Lớp"
                                                name="className"
                                                variant="outlined"
                                                fullWidth 
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <TextField
                                                onChange={formik.handleChange} 
                                                value={formik.values.schoolYear} 
                                                id="schoolYear" 
                                                label="Khóa"
                                                name="schoolYear"
                                                variant="outlined"
                                                fullWidth 
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <InputSelectCustom
                                                id={"major"}
                                                name={"major"}
                                                onChange={formik.handleChange}
                                                value={formik.values.major}
                                                placeholder="Chuyên ngành"
                                                label="Chuyên ngành"
                                                onBlur={undefined}
                                            >
                                                <MenuItem value={""}>Tất cả</MenuItem>
                                                {
                                                    majorOptions && majorOptions.map((x)=>{
                                                        return <MenuItem key={x.majorId} value={x.majorId}>{x.majorName}</MenuItem>
                                                    })
                                                }
                                            </InputSelectCustom>
                                        </div>

                                        <div className="col-span-3">
                                            <InputSelectCustom
                                                id={"status"}
                                                name={"status"}
                                                onChange={formik.handleChange}
                                                value={formik.values.status}
                                                placeholder="Trạng thái"
                                                label="Trạng thái"
                                                onBlur={undefined}
                                            >
                                                <MenuItem value={""}>Tất cả</MenuItem>
                                                {
                                                    statusOption && statusOption.map((x)=>{
                                                        return <MenuItem key={x.code} value={x.code}>{x.value}</MenuItem>
                                                    })
                                                }
                                            </InputSelectCustom>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-5">
                                        <div className="flex">
                                            <div className="me-2" onClick={()=>{
                                                setPaginationModel({
                                                    page: 0,
                                                    pageSize: 10,
                                                    pageMax: -1
                                                })
                                            }}>
                                                <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
                                                    Tìm kiếm
                                                </Button>
                                            </div>
                                            <div>
                                                <Button variant="text" onClick={()=>{
                                                    formik.resetForm(initialData)
                                                }}>
                                                    <RefreshIcon />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setSwitchPageInput(true)}>
                                                Thêm mới
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            }

                            {/* Danh sách tìm kiếm */}
                            <div className="mt-5">
                                <DataGrid
                                    apiRef={apiRefStudent}
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
                                    onPaginationModelChange={handlePaginationModelChange}
                                    onCellClick={({row})=>{
                                        handleOpenAssignMentor();
                                        setUserSelectStudent(row);
                                    }}
                                    initialState={{
                                    pagination: {
                                        paginationModel: { page: paginationModel.page, pageSize: paginationModel.pageSize },
                                    },
                                    }}
                                    pageSizeOptions={[5, 10]}
                                />
                        </div>
                    </div>
                    }

                    <Modal
                        open={openModalAssignMentor}
                        onClose={handleCloseAssignMentor}
                        aria-labelledby="modal-modal-title-mentor-assign"
                        aria-describedby="modal-modal-description-mentor-assign"
                    >
                        <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                            Gán giảng viên hướng dẫn
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
                                            setPaginationModelTeacher({
                                                page: 0,
                                                pageSize: 5,
                                                pageMax: -1
                                            })
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
                                <DataGrid
                                    apiRef={apiRefTeacher}
                                    rows={rowsTeacher}
                                    columns={columnsTeacher}
                                    rowCount={totalTeacher}
                                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                    onPaginationModelChange={handlePaginationModelChangeTeacher}
                                    onCellClick={({row})=>{
                                        console.log(row)
                                        setUserSelectTeacher(row)
                                        
                                    }}
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
                            </div>

                            <div className="mt-5 flex justify-end" >
                                <Button variant="contained" onClick={()=>{
                                console.log(userSelectStudent.userName, userSelectTeacher.userName)
                                if(userSelectStudent.userName && userSelectTeacher.userName){
                                    assignTeacherMentor(userSelectStudent.userName,userSelectTeacher.userName)
                                    .then((res:IResponse<any>)=>{
                                        if(res.success){
                                            toast.success(res.msg);
                                            setOpenModalAssignMentor(false);
                                            hanleFetchApiListStudent();
                                            setPaginationModel({
                                                page: 0,
                                                pageSize: 10,
                                                pageMax: -1
                                            })
                                        }else{
                                            toast.error(res.msg)
                                        }
                                    })
                                    .catch((error)=>{
                                        toast.error("Lỗi mạng !")
                                    })
                                }else{
                                    if(!userSelectStudent.userName){
                                        toast.error("Sinh viên không hợp lệ !")
                                    }
                                    if(!userSelectTeacher.userName){
                                        toast.error("Giảng viên không hợp lệ !")
                                    }
                                }
                            }}>Gán giảng viên hướng dẫn</Button>
                            </div>
                            
                        </div>
                    </Modal>

                    {/* Popup thông báo xác nhận xóa sinh viên */}
                    <Modal
                            open={openModalDelete}
                            onClose={handleCloseDelete}
                            aria-labelledby="modal-modal-title-delete"
                            aria-describedby="modal-modal-description-delete"
                        >
                            <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="title mb-10" >
                                    <div className="text-2xl text-center text-primary-blue font-bold">
                                        Thông báo xác nhận xóa sinh viên
                                    </div>
                                </div>
                                <div className={``}>
                                    <div className="flex justify-center">
                                        <span className="text-xl text-center font-medium">Bạn có muốn xóa sinh viên {userSelectStudent.userName} ?</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-10">
                                    {/* if there is a button in form, it will close the modal */}
                                    <div className="mx-5">
                                        <Button variant="outlined" onClick={handleCloseDelete}>Đóng</Button>
                                    </div>
                                    <div>
                                        <Button variant="contained" onClick={()=>{
                                            hanleDeleteAccount();
                                            handleCloseDelete();
                                        }}>Xác nhận</Button>
                                    </div>
                                </div>
                            </div>
                    </Modal>
                    
            </div> 
        </BoxWrapper>
    );
}

export default StudentManager;