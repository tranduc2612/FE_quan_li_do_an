import { Button, MenuItem, Modal, TextField } from "@mui/material";
import { useFormik } from "formik";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import InputSelectCustom from "~/components/InputSelectCustom";
import { useEffect, useState } from "react";
import { ChevronLeft, Delete } from "mdi-material-ui";
import LoadingData from "~/components/LoadingData";
import {IPageProps} from "../index"
import { getListClassification } from "~/services/classificationApi";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IClassificationType } from "~/types/IClassificationType";
import { getListMajor } from "~/services/majorApi";
import { IMajorType } from "~/types/IMajorType";
import { DataGrid, GridColDef, GridPaginationModel, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useNavigate } from 'react-router-dom';
import ModalCustom from "~/components/Modal";
import { toast } from "react-toastify";
import { ITeacher } from "~/types/ITeacherType";
import { deleteTeacher, getListTeacher } from "~/services/teacherApi";
import RegisterTeacher from "./input";
import BoxWrapper from "~/components/BoxWrap";
import { renderStatusAccount } from "~/ultis/common";




function TeacherManager({setCurrentPage}:IPageProps) {
    const [rows,setRows] = useState<any>([]);
    const navigate = useNavigate();
    const [userSelect,setUserSelect] = useState<ITeacher>({
        userName:"",
        passwordText:"",
        fullName:"",
        dob: new Date(),
        phone:"",
        email:"",
        avatar:"",
        createdAt: new Date(),
        createdBy:"",
        status:"",
        isAdmin:"",
        teacherCode:"",
        majorId:"",
        education:""
    });
    const [switchPageInput,setSwitchPageInput] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
        pageMax: -1
    });
    const apiRef = useGridApiRef();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [total, setTotal] = useState(0);
    const [semesterOption,setSemesterOption] = useState<ISemester[]>();
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();
    const [loading,setLoading] = useState(false);
    const initialData = {
        username: "",
        fullname:"",
        teacher_code: "",
        major: "",
        status:"",
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
            field: 'gender',
            headerName: 'Giới tính',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.gender == 1 ? "Nữ" : "Nam"}</>
            }
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
            renderCell:({row})=>{
                return <>{
                    <span className={`${row?.status == "BLOCK" ? "text-red-600" : "text-green-600"}`}>{renderStatusAccount(row?.status)}</span>
                }</>
            }
        },
        {
            field: 'action',
            headerName: 'Chức năng',
            width: 160,
            editable: true,
            renderCell:({row})=>{
                return <>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-red-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalDelete(true);
                            setUserSelect(row);
                    }}>
                        <Delete />
                    </div>
    
    
                </>
            }
        },
    ];

    useEffect(()=>{
        setLoading(true);
        Promise.all([
            getListClassification({
                typeCode: "STATUS_SYSTEM"
            }),
            getListMajor({
                majorId:"",
                majorName:""
            })
        ])
        .then((responses:IResponse<any>[]) => {
            const statusRes:IResponse<any> = responses[0];
            const majorState:IResponse<IMajorType[]> = responses[1];

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
        hanleFetchApi();
    },[switchPageInput,paginationModel])

    const hanleFetchApi = async () => {
        if(paginationModel.page <= paginationModel.pageMax){
            return;
        }
        await getListTeacher({
            pageSize: paginationModel.pageSize,
            pageIndex:  paginationModel.page + 1,
            userName:  formik.values.username,
            fullName: formik.values.fullname,
            teacherCode:  formik.values.teacher_code,
            majorId: formik.values.major,
            status: formik.values.status,
        })
        .then((res:IResponse<any>)=>{
          console.log(res)
          if(res.success && res.returnObj && res.returnObj.listResult) {
            console.log(res.returnObj.listResult)
            const dataMap = res.returnObj.listResult;
            const newMap = dataMap.map((data:ITeacher,index:any)=>{
                return {
                  id: rows.length * paginationModel.page + index + 1,
                  ...data,
                }
            })
            const totalItem = res.returnObj.totalItem;
            setTotal(totalItem)
            if(totalItem === 0){
                setRows([])
            }else if(paginationModel.page == 0 && paginationModel.pageMax == -1){
                apiRef.current.setPage(0)
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

    const formik = useFormik({
        initialValues: initialData,
        onSubmit: (values) => {
          console.log(values);
        },
    });

    const handleOpen = () => setOpenModalDelete(true);
    const handleClose = () => setOpenModalDelete(false);

    const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModel({
            ...paginationModel,
            page:newPaginationModel.page
        })
    };

    const hanleDeleteAccount = ()=>{
        deleteTeacher(userSelect.userName || "")
        .then((res:any)=>{
            console.log(res);
            if(res.success){
                toast.success(res.msg)
                hanleFetchApi();
            }else{
                toast.error(res.msg)
            }
        })
        .catch((err:any)=>{
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
                        <Button onClick={()=>{setSwitchPageInput(false)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                        </Button>
                    </div>
                } 
                    <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                        {switchPageInput ? "Thêm giảng viên": "Danh sách giảng viên "}
                    </h2>
                    {
                        switchPageInput ?
                            <RegisterTeacher switchPageInput={switchPageInput} setSwitchPageInput={setSwitchPageInput} userName={userSelect} /> 
                            : <div>
                        {/* Form tìm kiếm */}
                        {
                            loading ? <LoadingData /> : 
                            <form action="" onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-12 gap-4">

                                    <div className="col-span-4">
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

                                    <div className="col-span-4">
                                        <TextField
                                            onChange={formik.handleChange} 
                                            value={formik.values.teacher_code} 
                                            id="teacher_code" 
                                            label="Mã giảng viên"
                                            name="teacher_code"
                                            variant="outlined"
                                            fullWidth 
                                        />
                                    </div>

                                    <div className="col-span-4">
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

                                    <div className="col-span-4">
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

                                    <div className="col-span-4">
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
                                        <div className="me-2">
                                            <Button type="submit" variant="outlined" startIcon={<SearchIcon />}
                                                onClick={()=>{
                                                    setPaginationModel({
                                                        page: 0,
                                                        pageSize: 10,
                                                        pageMax: -1
                                                    })
                                                }}
                                            >
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
                                
                                rows={rows}
                                columns={columns}
                                rowCount={total}
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                onPaginationModelChange={handlePaginationModelChange}
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
                            open={openModalDelete}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="title mb-10" >
                                    <div className="text-2xl text-center text-primary-blue font-bold">
                                        Thông báo xác nhận xóa giảng viên
                                    </div>
                                </div>
                                <div className={``}>
                                    <div className="flex justify-center">
                                        <span className="text-xl text-center font-medium">Bạn có muốn xóa giảng viên {userSelect.userName} ?</span>
                                    </div>
                                </div>
                                        
                                <div className="flex justify-center mt-10">
                                    {/* if there is a button in form, it will close the modal */}
                                    <div className="mx-5">
                                        <Button variant="outlined" onClick={handleClose}>Đóng</Button>
                                    </div>
                                    <div>
                                        <Button variant="contained" onClick={()=>{
                                            hanleDeleteAccount();
                                            handleClose();
                                        }}>Xác nhận</Button>
                                    </div>
                                </div>
                            </div>
                    </Modal>
                    
            </div> 
        </BoxWrapper> 
    );
}

export default TeacherManager;