import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { Button, MenuItem, Modal, TextField, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { AccountEdit, ChevronLeft, Delete, Printer } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import BoxWrapper from "~/components/BoxWrap";
import InputSelectCustom from "~/components/InputSelectCustom";
import LoadingData from "~/components/LoadingData";
import { getListClassification } from "~/services/classificationApi";
import { getListMajor } from "~/services/majorApi";
import { deleteTeacher, getListTeacher } from "~/services/teacherApi";
import { IClassificationType } from "~/types/IClassificationType";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";
import { ITeacher } from "~/types/ITeacherType";
import { renderStatusAccount } from "~/ultis/common";
import { IPageProps } from "../index";
import RegisterTeacher from "./input";
import { getExcelListTeacher } from '~/services/reportApi';

// const validationSchema = yup.object({
//     username: yup
//       .string()
//       .min(8, 'Mật khẩu phải có ít nhất 8 kí tự')
//       .matches(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ viết thường')
//       .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ viết hoa')
//       .matches(/^[^\W_]+$/, "Mật khẩu không được chứa kí tự đặc biệt")
//     //   .matches(/[$&+,:;=?@#|'<>.^*()%!-]/, "Mật khẩu không được chứa kí tự đặc biệt")
//       .required('Mật khẩu không được để trống'),
//   });


function TeacherManager({setCurrentPage}:IPageProps) {
    const [rows,setRows] = useState<any>([]);
    const navigate = useNavigate();
    const [userSelect,setUserSelect] = useState<ITeacher>({
        userName:undefined,
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
        majorId:"",
        educationId:""
    });
    const [switchPageInput,setSwitchPageInput] = useState(false);
    const [paginationModel, a] = useState({
        pageSize: 5,
        page: 0,
        pageMax: -1
    });
    const apiRef = useGridApiRef();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();
    const [loading,setLoading] = useState(false);
    const initialData = {
        username: "",
        fullname:"",
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
            field: 'action',
            headerName: 'Thao tác',
            width: 150,
            editable: true,
            renderCell:({row})=>{
                return <>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-red-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalDelete(true);
                            setUserSelect(row);
                    }}>
                        <Tooltip title="Xóa giảng viên">
                            <Delete />
                        </Tooltip>
                    </div>

                    <div className="cursor-pointer p-1 hover:bg-slate-300 rounded-full text-blue-500 mx-1" onClick={(e)=>{
                            e.stopPropagation();
                            setSwitchPageInput(true);
                            setUserSelect(row);
                    }}>
                        <Tooltip title="Chỉnh sửa thông tin">
                            <AccountEdit />
                        </Tooltip>
                    </div>
    
    
                </>
            }
        },
        {
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 200,
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
            width: 130,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.gender == 1 ? "Nữ" : "Nam"}</>
            }
        },
        {
            field: 'educationName',
            headerName: 'Học vị',
            width: 150,
            editable: true,
        },
        {
            field: 'isAdmin',
            headerName: 'Vai trò',
            width: 150,
            editable: true,
            renderCell:({row})=>{
                return <>{row?.isAdmin == 1 ? "Quản trị viên" : "Giảng viên"}</>
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
    },[])

    const hanleFetchApi = async () => {
        await getListTeacher({
            pageSize: paginationModel.pageSize,
            pageIndex:  paginationModel.page + 1,
            userName:  formik.values.username,
            fullName: formik.values.fullname,
            majorId: formik.values.major,
            status: formik.values.status,
        })
        .then((res:IResponse<any>)=>{
          console.log(res)
          if(res.success && res.returnObj && res.returnObj.listResult) {
            const dataMap = res.returnObj.listResult;
            const newMap = dataMap.map((data:ITeacher,index:any)=>{
                return {
                  id: rows.length * paginationModel.page + index + 1,
                  ...data,
                  ...data?.education
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

    const formik = useFormik({
        initialValues: initialData,
        
        onSubmit: (values) => {
          console.log(values);
        },
    });

    const handleOpen = () => setOpenModalDelete(true);
    const handleClose = () => setOpenModalDelete(false);


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
                        <Button onClick={()=>{
                            setUserSelect({
                                userName:undefined,
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
                                majorId:"",
                                educationId:""
                            })   
                            setSwitchPageInput(false)
                            }} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                        </Button>
                    </div>
                } 
                    <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                        {switchPageInput ? userSelect?.userName ? "Cập nhật giảng viên" : "Thêm giảng viên" : "Danh sách giảng viên "}
                    </h2>
                    {
                        switchPageInput ?
                            <RegisterTeacher 
                                switchPageInput={switchPageInput} 
                                setSwitchPageInput={setSwitchPageInput} 
                                userSelect={userSelect} 
                                handleFetchApi={hanleFetchApi}
                            /> 
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
                                                    hanleFetchApi()
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

                                    <div className='flex'>
                                        <div className='mx-5'>
                                            <Button variant="text" startIcon={<Printer />} onClick={()=>{
                                                getExcelListTeacher({
                                                    pageSize: paginationModel.pageSize,
                                                    pageIndex:  paginationModel.page + 1,
                                                    userName:  formik.values.username.trim(),
                                                    fullName: formik.values.fullname.trim(),
                                                    majorId: formik.values.major.trim(),
                                                    status: formik.values.status.trim(),
                                                })
                                                .then((res:any)=>{
                                                    const link = document.createElement('a');
                                                    const fileName = 'DanhSachGiangVien.xlsx';
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
                                                setUserSelect({
                                                    userName:undefined,
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
                                                    majorId:"",
                                                    educationId:""
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