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
// import RegisterTeacher from "./input";
import BoxWrapper from "~/components/BoxWrap";
import { addGroupReview, deleteGroupReview, getListReviewOutline, updateGroupReview } from "~/services/groupReviewOutlineApi";
import { IGroupReviewOutline } from "~/types/IGroupReviewOutline";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import { formatDateTypeDateOnly } from "~/ultis/common";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import Edit from "@mui/icons-material/Edit";


const validationSchema = yup.object({
    groupReviewOutlineId: yup
      .string()
      .required('Mã nhóm xét duyệt'),
      nameGroupReviewOutline: yup
      .string()
      .required('Tên nhóm xét duyệt'),

  });



function GroupReviewOutlineManager({setCurrentPage}:IPageProps) {
    const [rows,setRows] = useState<any>([]);
    const info = useAppSelector(inforUser);
    const navigate = useNavigate();
    const [groupSelected,setGroupSelected] = useState<IGroupReviewOutline>({
        groupReviewOutlineId: "",
        nameGroupReviewOutline: "",
        createdBy: "",
        isDelete: 0,
        createdDate: new Date()
    });
    const [openModalInput,setOpenModalInput] = useState(false);
    const [openModalInputEdit,setOpenModalInputEdit] = useState(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
        pageMax: -1
    });
    const apiRef = useGridApiRef();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [total, setTotal] = useState(0);
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
            width: 250,
            editable: true,
        },
        {
            field: 'createdDate',
            headerName: 'Thời gian tạo',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {formatDateTypeDateOnly(row?.createdDate)}
                </>
            }
        },
        {
            field: 'createdBy',
            headerName: 'Người tạo',
            width: 250,
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
                            e.stopPropagation();
                            setOpenModalInputEdit(true);
                            setGroupSelected(row);
                            formikInputEdit.values.groupReviewOutlineId = row?.groupReviewOutlineId;
                            formikInputEdit.values.nameGroupReviewOutline = row?.nameGroupReviewOutline;
                    }}>
                        <Edit />
                    </div>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-red-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalDelete(true);
                            setGroupSelected(row);
                    }}>
                        <Delete />
                    </div>
                    
    
                </>
            }
        },
    ];

    useEffect(()=>{
        hanleFetchApi();
    },[paginationModel])

    const hanleFetchApi = async () => {
        if(paginationModel.page <= paginationModel.pageMax){
            return;
        }
        await getListReviewOutline({
            pageSize: paginationModel.pageSize,
            pageIndex:  paginationModel.page + 1,
            groupReviewOutlineId: formik.values.groupReviewOutlineId,
            nameGroupReviewOutline: formik.values.nameGroupReviewOutline
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
                        pageSize: 10,
                        pageMax: -1
                    })
                    toast.success(res.msg)
                }else{
                    setErrors({ groupReviewOutlineId: res.msg})
                }
            })
        },
    });

    const formikInputEdit = useFormik({
        initialValues: {
            groupReviewOutlineId: groupSelected.groupReviewOutlineId,
            nameGroupReviewOutline: groupSelected.nameGroupReviewOutline,
        },
        validationSchema: validationSchema,
        onSubmit: (values,{ setSubmitting, setErrors, setStatus }) => {
          console.log(values);
          const req: IGroupReviewOutline = {
            groupReviewOutlineId: values.groupReviewOutlineId,
            nameGroupReviewOutline: values.nameGroupReviewOutline,
            createdBy:info?.userName
          }
          console.log(req);
          updateGroupReview(req)
            .then((res:IResponse<any>)=>{
                if(res.success){
                    setOpenModalInputEdit(false)
                    formikInputEdit.resetForm();
                    setPaginationModel({
                        page: 0,
                        pageSize: 10,
                        pageMax: -1
                    })
                    toast.success(res.msg)
                }else{
                    setErrors({ groupReviewOutlineId: res.msg})
                }
            })
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

    const hanleDeleteGroup = ()=>{
        deleteGroupReview(groupSelected.groupReviewOutlineId || "")
        .then((res:any)=>{
            console.log(res);
            if(res.success){
                toast.success(res.msg)
                setPaginationModel({
                    page: 0,
                    pageSize: 10,
                    pageMax: -1
                })
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
                    <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                        Danh sách nhóm xét duyệt
                    </h2>
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
                                                formik.resetForm()
                                            }}>
                                                <RefreshIcon />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <Button variant="contained" startIcon={<AddIcon />} onClick={()=>{
                                            setOpenModalInput(true)
                                            formikInput.resetForm();
                                        }}>
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
                        open={openModalDelete}
                        onClose={handleClose}
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
                                        <Button variant="outlined" onClick={handleClose}>Đóng</Button>
                                    </div>
                                    <div>
                                        <Button variant="contained" onClick={()=>{
                                            hanleDeleteGroup();
                                            handleClose();
                                        }}>Xóa</Button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    

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
                                        <div className="">
                                        <Button variant="outlined" onClick={()=>{
                                            setOpenModalInput(false);
                                            formikInput.resetForm();
                                        }}>Đóng</Button>
                                        </div>
                                        <div>
                                            <Button variant="contained" onClick={()=>{
                                             
                                            }}>Thêm mới</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                    </Modal>

                    <Modal
                        open={openModalInputEdit}
                        onClose={()=>setOpenModalInputEdit(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                                    Chỉnh sửa nhóm xét duyệt 
                                </h2>
                                <form method="dialog" onSubmit={formikInputEdit.handleSubmit}>
                                    <div className="">
                                        <div className="my-5">
                                            <InputCustom
                                                id={"groupReviewOutlineId"}
                                                label="Mã phòng xét duyệt"
                                                name={"groupReviewOutlineId"}
                                                value={formikInputEdit.values.groupReviewOutlineId} 
                                                onChange={formikInputEdit.handleChange}
                                                onBlur={formikInputEdit.handleBlur}
                                                isError={formikInputEdit.touched.groupReviewOutlineId && Boolean(formikInputEdit.errors.groupReviewOutlineId)} 
                                                errorMessage={formikInputEdit.touched.groupReviewOutlineId && formikInputEdit.errors.groupReviewOutlineId} 
                                            />
                                        </div>

                                        <div className="my-5">
                                            <InputCustom
                                                id={"nameGroupReviewOutline"}
                                                label="Tên phòng xét duyệt"
                                                name={"nameGroupReviewOutline"}
                                                value={formikInputEdit.values.nameGroupReviewOutline} 
                                                onChange={formikInputEdit.handleChange}
                                                onBlur={formikInputEdit.handleBlur}
                                                isError={formikInputEdit.touched.nameGroupReviewOutline && Boolean(formikInputEdit.errors.nameGroupReviewOutline)} 
                                                errorMessage={formikInputEdit.touched.nameGroupReviewOutline && formikInputEdit.errors.nameGroupReviewOutline} 
                                            />
                                        </div>
                                    </div>
                                        <div className="flex justify-center mt-10">
                                    {/* if there is a button in form, it will close the modal */}
                                            <div className="mx-5">
                                                <Button variant="outlined" onClick={()=>{
                                                    setOpenModalInputEdit(false);
                                                    formikInputEdit.resetForm();
                                                }}>Đóng</Button>
                                            </div>
                                            <div>
                                                <Button variant="contained" onClick={()=>{
                                                }}>Chỉnh sửa</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                    </Modal>
            </div> 
        </BoxWrapper> 
    );
}

export default GroupReviewOutlineManager;