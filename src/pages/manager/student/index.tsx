import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { Button, MenuItem, Modal, TextField, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { AccountEdit, ChevronLeft, Delete, Download, Printer } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import BoxWrapper from "~/components/BoxWrap";
import InputSelectCustom from "~/components/InputSelectCustom";
import LoadingData from "~/components/LoadingData";
import { getListClassification } from "~/services/classificationApi";
import { getListMajor } from "~/services/majorApi";
import { assignTeacherMentor } from "~/services/projectApi";
import { getListSemester } from "~/services/semesterApi";
import { deleteStudent, getListStudent } from "~/services/studentApi";
import { getListTeacher } from "~/services/teacherApi";
import { IClassificationType } from "~/types/IClassificationType";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IStudent } from "~/types/IStudentType";
import { ITeacher } from "~/types/ITeacherType";
import { IBaseList } from "~/types/IbaseList";
import { renderStatusAccount } from "~/ultis/common";
import { IPageProps } from "../index";
import RegisterStudent from "./input";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Loading from '~/components/Loading';
import RenderStatusProject from '~/components/RenderStatusProject';
import { getExcelListStudent, getTemplateFileAddStudent, uploadFileAddStudent } from '~/services/reportApi';
import fileDownload from 'js-file-download';
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

function StudentManager({setCurrentPage}:IPageProps) {
    const [rows,setRows] = useState<any>([]);
    const [rowsTeacher,setRowsTeacher] = useState<any>([]);
    const navigate = useNavigate();
    const apiRefStudent = useGridApiRef();
    const apiRefTeacher = useGridApiRef();
    const [addListStudent,setAddListStudent] = useState(false);

    const [valueSearchTeacher,setValueSearchTeacher] = useState("");
    const [userSelectStudent,setUserSelectStudent] = useState<IStudent>({
        passwordText: "",
        userName: undefined,
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
        pageSize: 5,
        page: 0,
        pageMax:-1
    });
    const [paginationModelTeacher, setPaginationModelTeacher] = useState({
        pageSize: 5,
        page: 0,
        pageMax:-1
    });
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalAssignMentor, setOpenModalAssignMentor] = useState(false);
    const [semesterOption,setSemesterOption] = useState<ISemester[]>();
    const [isErrorList,setIsErrorList] = useState(false);
    const [blobError,setBlobError] = useState<any>(null);
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();
    const [fileListStudent,setFileListStudent] = useState<any>()
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
    const formik = useFormik({
        initialValues: initialData,
        onSubmit: (values) => {
          console.log(values);
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
                            handleOpenAssignMentor();
                            setUserSelectStudent(row);
                    }}>
                        <Tooltip title="Gán giảng viên hướng dẫn">
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
            width: 100,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.gender == 1 ? "Nữ" : "Nam"}</>
            }
        },
        {
            field: 'schoolYearName',
            headerName: 'Khóa',
            width: 100,
            editable: true,
        },
        {
            field: 'className',
            headerName: 'Lớp',
            width: 100,
            editable: true,
        },
        {
            field: 'gpa',
            headerName: 'GPA',
            width: 100,
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
            field: 'statusProject',
            headerName: 'Trạng thái làm đồ án',
            width: 200,
            editable: true,
            renderCell:({row})=><RenderStatusProject code={row?.statusProject} />
        },
        {
            field: 'status',
            headerName: 'Trạng thái tài khoản',
            width: 160,
            editable: true,
            renderCell:({row})=>{
                return <>{
                    <span className={`${row?.status == "BLOCK" ? "text-red-600" : "text-green-600"}`}>{renderStatusAccount(row?.status)}</span>
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
            renderCell:({row})=>{
                return <span className={`${row?.status === "BLOCK" ? "text-red-600" : "text-green-600"}`}>{renderStatusAccount(row?.status)}</span>
            }
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
                formik.values.semester = semesterRes.returnObj[0].semesterId;
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
            // hanleFetchApiListStudent();
            setLoading(false)
        })
    },[]);

    useEffect(()=>{
        handleFetchApiTeacherList();
    },[])

    useEffect(()=>{
        if(formik.values.semester){
            hanleFetchApiListStudent()
        }
    },[formik.values.semester])

    const hanleFetchApiListStudent = async () => {
        await getListStudent({
            pageSize: paginationModel.pageSize,
            pageIndex:  paginationModel.page + 1,
            userName:  formik.values.username.trim(),
            fullName: formik.values.fullname.trim(),
            studentCode:  formik.values.student_code.trim(),
            majorId: formik.values.major.trim(),
            status: formik.values.status.trim(),
            semesterId: formik.values.semester,
            className:  formik.values.className.trim(),
            schoolYear: formik.values.schoolYear.trim()
        })
        .then((res:IResponse<IBaseList<IStudent>>)=>{
          console.log(res)
          if(res.success && res.returnObj && res.returnObj.listResult) {
            console.log(res.returnObj.listResult)
            const dataMap = res.returnObj.listResult;
            const newMap = dataMap.map((data:IStudent,index:any)=>{
                return {
                id: index+1,
                  ...data,
                  ...data?.project
                }
            })
            const totalItem = res.returnObj.totalItem;
            if(totalItem === 0){
                setRows([])
            }else {
                setRows([...newMap])
            }
          }
        })

    }

    const handleFetchApiTeacherList = async ()=>{
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
                    id: index+1,
                  ...data,
                }
            }).filter((x:any)=>x.status !== "BLOCK")
            const totalItem = newMap.length;
            if(totalItem === 0){
                setRowsTeacher([])
            }else {
                setRowsTeacher([...newMap])
            } 
          }
        })
    }

    


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
            <>
                {loading && <Loading />}
                <div className="p-4 overflow-scroll max-h-screen">
                    {
                        switchPageInput && 
                        <div className="mb-4 flex justify-between">
                            <Button onClick={()=>{
                                setSwitchPageInput(false)
                                setUserSelectStudent({
                                    passwordText: "",
                                    userName: undefined,
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
                            
                            {
                                userSelectStudent?.userName === undefined &&
                                <div className='flex items-center'>
                                    {
                                        isErrorList &&
                                        <div className='cursor-pointer underline text-red-600' onClick={()=>{
                                            if(blobError){
                                                const link = document.createElement('a');
                                                const fileName = 'DanhSachSinhVienLoi.xlsx';
                                                link.setAttribute('download', fileName);
                                                link.href = URL.createObjectURL(new Blob([blobError]));
                                                document.body.appendChild(link);
                                                link.click();
                                                link.remove();
                                            }
                                        }}>
                                            <Download />
                                            file lỗi
                                        </div>
                                    }
                                    <div className='mx-5 cursor-pointer underline text-primary-blue' onClick={()=>{
                                        getTemplateFileAddStudent()
                                        .then((res:any)=>{
                                            const link = document.createElement('a');
                                            const fileName = 'TemplateFileThemSinhVien.xlsx';
                                            link.setAttribute('download', fileName);
                                            link.href = URL.createObjectURL(new Blob([res]));
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                        })
                                    }}>
                                        <Download />
                                        file mẫu
                                    </div>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        >
                                            Thêm nhiều sinh viên
                                            <VisuallyHiddenInput type="file" accept=".xlsx, .xls" 
                                                onClick={(e:any)=>{
                                                    e.target.value = null
                                                }}
                                                onChange={(e:any)=>{
                                                const file = e.target.files[0]; // Lấy file đầu tiên trong danh sách file được chọn
                                                const fileName = file.name; // Lấy tên file
                                            
                                                const allowedExtensions = [".xlsx", ".xls"];
                                                const fileExtension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
                                            
                                                if (!allowedExtensions.includes(fileExtension)) {
                                                    toast.warn("Chỉ chấp nhận file Excel !")
                                                // Xử lý khi file không hợp lệ
                                                return;
                                                }
                                                setFileListStudent(file);
                                                setAddListStudent(true);
                                            }}/>
                                    </Button>
                                </div>
                            }
                        </div>
                    } 
                        <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                            {switchPageInput ? "Thêm sinh viên ": "Danh sách sinh viên "}
                        </h2>
                        {
                            switchPageInput ? <RegisterStudent switchPageInput={switchPageInput} setSwitchPageInput={setSwitchPageInput} userSelect={userSelectStudent} setUserSelect={setUserSelectStudent} hanleFetchApiListStudent={hanleFetchApiListStudent}/> : 
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
                                                    hanleFetchApiListStudent();
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
                                            
                                            <div className='flex'>
                                                <div className='mx-5'>
                                                    <Button variant="text" startIcon={<Printer />} onClick={()=>{
                                                        getExcelListStudent({
                                                            pageSize: paginationModel.pageSize,
                                                            pageIndex:  paginationModel.page + 1,
                                                            userName:  formik.values.username.trim(),
                                                            fullName: formik.values.fullname.trim(),
                                                            studentCode:  formik.values.student_code.trim(),
                                                            majorId: formik.values.major.trim(),
                                                            status: formik.values.status.trim(),
                                                            semesterId: formik.values.semester,
                                                            className:  formik.values.className.trim(),
                                                            schoolYear: formik.values.schoolYear.trim()
                                                        })
                                                        .then((res:any)=>{
                                                            const link = document.createElement('a');
                                                            const fileName = 'DanhSachSinhVien.xlsx';
                                                            link.setAttribute('download', fileName);
                                                            link.href = URL.createObjectURL(new Blob([res]));
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            link.remove();

                                                        })
                                                    }}>
                                                        Excel
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button variant="contained" startIcon={<AddIcon />} onClick={()=>{
                                                        setSwitchPageInput(true)
                                                        setUserSelectStudent({
                                                            passwordText: "",
                                                            userName: undefined,
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
                                                    }}>
                                                        Thêm mới
                                                    </Button>
                                                </div>
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
                                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                        onCellClick={({row})=>{
                                            navigate("/profile/"+row.userName)
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
                                    <DataGrid
                                        apiRef={apiRefTeacher}
                                        rows={rowsTeacher}
                                        columns={columnsTeacher}
                                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
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
                                    <div className="mx-2">
                                        <Button variant="outlined" onClick={()=>handleCloseAssignMentor()}>Đóng</Button>
                                    </div>
                                    <div>
                                            <Button variant="contained" onClick={()=>{
                                            console.log(userSelectStudent.userName, userSelectTeacher.userName)
                                            if(userSelectStudent.userName && userSelectTeacher.userName){
                                                assignTeacherMentor(userSelectStudent.userName,userSelectTeacher.userName)
                                                .then((res:IResponse<any>)=>{
                                                    if(res.success){
                                                        toast.success(res.msg);
                                                        setOpenModalAssignMentor(false);
                                                        hanleFetchApiListStudent();
                                                        handleFetchApiTeacherList();
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
                        

                        <Modal
                                open={addListStudent}
                                onClose={()=>setAddListStudent(false)}
                                aria-labelledby="modal-modal-title-delete"
                                aria-describedby="modal-modal-description-delete"
                            >
                                <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="title mb-10" >
                                        <div className="text-2xl text-center text-primary-blue font-bold">
                                            Thông báo xác nhận thêm danh sách sinh viên
                                        </div>
                                    </div>
                                    <div className={``}>
                                        <div className="flex justify-center">
                                            <span className="text-xl text-center font-medium">Bạn có muốn thêm danh sách sinh viên trong <span className='text-primary-blue underline'>{fileListStudent?.name}</span> với mã học kỳ <span className='text-primary-blue underline'>{formik.values.semester}</span>?</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-10">
                                        {/* if there is a button in form, it will close the modal */}
                                        <div className="mx-5">
                                            <Button variant="outlined" onClick={()=>{
                                                setAddListStudent(false)
                                            }}>Đóng</Button>
                                        </div>
                                        <div>
                                            <Button variant="contained" onClick={()=>{
                                                
                                                setLoading(true)
                                                const form = new FormData();
                                                form.append("semesterId",formik.values.semester || "");
                                                form.append("file", fileListStudent);
                                                uploadFileAddStudent(form)
                                                .then((res:any)=>{
                                                    if(res.data.size === 0){
                                                        setIsErrorList(false)
                                                    }else{
                                                        setBlobError(res.data)
                                                        setIsErrorList(true)
                                                    }
                                                    toast.success("Thêm sinh viên thành công !")
                                                    setLoading(false);
                                                })
                                                setAddListStudent(false)

                                            }}>Xác nhận</Button>
                                        </div>
                                    </div>
                                </div>
                        </Modal>
                </div> 
            </>
        </BoxWrapper>
    );
}

export default StudentManager;