import CalculateIcon from '@mui/icons-material/Calculate';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, Modal, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { Delete } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import LoadingData from "~/components/LoadingData";
import { IResponse } from "~/types/IResponse";
// import RegisterTeacher from "./input";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import * as yup from 'yup';
import InputCustom from "~/components/InputCustom";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { AssignCouncilTeaching, AutoSplitCouncil, addCouncil, assginCouncilToTeaching, deleteCouncil, lstCouncilSemester, updateCouncil } from "~/services/councilApi";
import { AssignGroupReviewTeaching, assginGroupReviewToTeaching, getListTeachingGroupOutline } from "~/services/groupReviewOutlineApi";
import { ICouncil, ICouncilSemester } from "~/types/ICouncil";
import { ITeaching } from "~/types/ITeachingType";
import { formatDateTypeDateOnly } from "~/ultis/common";
import Loading from '~/components/Loading';


const validationSchema = yup.object({
      nameCouncil: yup
      .string()
      .required('Tên nhóm hội đồng không đươch để trống'),
      zoomCouncil: yup
      .string()
      .required('Địa điểm bảo vệ không được để trống'),
  });



function CouncilSemester() {
    const [rows,setRows] = useState<any>([]);
    const {id} = useParams();
    const info = useAppSelector(inforUser);
    const navigate = useNavigate();
    const [councilSelected,setCouncilSelected] = useState<ICouncil>({
        councilId: undefined,
        councilName: "",
        councilZoom: "",
        createdBy: "",
        isDelete: 0,
        createdDate: new Date()
    });
    
    const [toggleAutoAssign,setToggleAutoAssign] = useState(false);
    const [openModalInputCouncil,setOpenModalInputCouncil] = useState(false);
    

    const apiRef = useGridApiRef();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [total, setTotal] = useState(0);
    const [loadingData,setLoadingData] = useState(false);
    const [loading,setLoading] = useState(false)

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
                    {/* <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-blue-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalAssign(true);
                            setCouncilSelected(row)
                    }}>
                        <Tooltip title="Thêm giảng viên vào nhóm">
                            <PersonAddIcon />
                        </Tooltip>
                    </div> */}
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-yellow-500" onClick={(e)=>{
                            e.stopPropagation();
                            setCouncilSelected(row);
                            formikInputGroup.values.nameCouncil = row?.councilName;
                            formikInputGroup.values.zoomCouncil = row?.councilZoom;
                            console.log(row)
                            setOpenModalInputCouncil(true);
                    }}>
                        <Tooltip title="Sửa nhóm hội đồng">
                            <Edit />
                        </Tooltip>
                    </div>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-red-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalDelete(true);
                            setCouncilSelected(row);
                    }}>
                        <Tooltip title="Xóa nhóm hội đồng">
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
            field: 'councilName',
            headerName: 'Tên hội đồng',
            width: 200,
            editable: false,
        },
        {
            field: 'councilZoom',
            headerName: 'Địa điểm bảo vệ',
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
    useEffect(()=>{
        hanleFetchApiCouncilList();
    },[])

    

    const hanleFetchApiCouncilList = async () => {
        const idSemester = id;
        await lstCouncilSemester({
            semesterId: idSemester
        })
        .then((res:IResponse<ICouncilSemester[]>)=>{
          console.log(res)
          if(res.success && res.returnObj) {
            const dataMap = res.returnObj;
            
            if(dataMap.length <= 0) {
                setTotal(0)
                setRows([])
            }else{
                const newMap = dataMap.map((data:ICouncilSemester,index:any)=>{
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

    

    const formikInputGroup = useFormik({
        initialValues: {
            nameCouncil: "",
            zoomCouncil: "",
            semesterId:id
        },
        validationSchema: validationSchema,
        onSubmit: (values,{ setSubmitting, setErrors, setStatus }) => {
          console.log(values);
          
          if(councilSelected.councilId){
            const req: ICouncilSemester = {
                councilId: councilSelected.councilId,
                councilName: formikInputGroup.values.nameCouncil,
                councilZoom: formikInputGroup.values.zoomCouncil,
                semesterId: values.semesterId,
                createdBy:info?.userName
              }
            updateCouncil(req)
                .then((res:IResponse<any>)=>{
                    if(res.success){
                        setOpenModalInputCouncil(false)
                        formikInputGroup.resetForm();
                        toast.success(res.msg)
                        hanleFetchApiCouncilList();
                    }else{
                        setErrors({ nameCouncil: res.msg})
                    }
                })
          }else{
            const req: ICouncilSemester = {
                councilName: formikInputGroup.values.nameCouncil,
                councilZoom: formikInputGroup.values.zoomCouncil,
                semesterId: values.semesterId,
                createdBy:info?.userName

              }
              addCouncil(req)
                .then((res:IResponse<any>)=>{
                    if(res.success){
                        setOpenModalInputCouncil(false)
                        formikInputGroup.resetForm();
                        toast.success(res.msg)
                        hanleFetchApiCouncilList();
                    }else{
                        setErrors({ nameCouncil: res.msg})
                    }
                })
            }
          }
    });
    console.log(formikInputGroup)

    const hanleDeleteGroup = ()=>{
        deleteCouncil(councilSelected.councilId || "")
        .then((res:any)=>{
            console.log(res);
            if(res.success){
                toast.success(res.msg)
                hanleFetchApiCouncilList()
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
            <div className="p-4 overflow-scroll overflow-x-hidden max-h-screen">
                {
                    loading &&
                    <Loading />
                }
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
                                    const idGroup = row?.councilId;
                                    if(idSemester && idGroup){
                                        navigate(`/semester/detail/council/${idSemester}/${idGroup}`);
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
                                        <Button onClick={()=>{
                                            const idSemester = id;
                                            if(!idSemester){
                                                toast.warning("Học kỳ không hợp lệ")
                                                return
                                            }
                                            setLoading(true)
                                            AutoSplitCouncil(idSemester || "",info?.userName || "")
                                            .then(x=>{
                                                if(x.success){
                                                    toast.success("Chia hội đồng thành công !");
                                                    hanleFetchApiCouncilList();

                                                }else{
                                                    toast.warning(x.msg);
                                                }
                                            })
                                            .finally(()=>{
                                                setLoading(false)
                                            })
                                        }} startIcon={<CalculateIcon />}>Tự động chia</Button>
                                        <Button variant='text' startIcon={<Add />} onClick={()=>{
                                            formikInputGroup.values.nameCouncil = ""
                                            setOpenModalInputCouncil(true)
                                            setCouncilSelected({
                                                councilId: undefined,
                                                councilName: "",
                                                createdBy: "",
                                                isDelete: 0,
                                                createdDate: new Date()
                                            })
                                        }}>
                                            Thêm mới nhóm hội đồng
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
                        open={openModalInputCouncil}
                        onClose={()=>{
                            setCouncilSelected({
                                councilId: undefined,
                                councilName: "",
                                createdBy: "",
                                isDelete: 0,
                                createdDate: new Date()
                            })
                            setOpenModalInputCouncil(false)
                        }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                         <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                                    {councilSelected?.councilId ? "Chỉnh sửa nhóm hội đồng" :"Thêm mới nhóm hội đồng"}
                                </h2>
                                <form method="dialog" onSubmit={formikInputGroup.handleSubmit}>
                                    <div className="">
                                        <div className="my-5">
                                            <div className='mb-5'>
                                                <InputCustom
                                                    id={"nameCouncil"}
                                                    label="Tên phòng hội đồng"
                                                    name={"nameCouncil"}
                                                    value={formikInputGroup.values.nameCouncil} 
                                                    onChange={formikInputGroup.handleChange}
                                                    onBlur={formikInputGroup.handleBlur}
                                                    isError={formikInputGroup.touched.nameCouncil && Boolean(formikInputGroup.errors.nameCouncil)} 
                                                    errorMessage={formikInputGroup.touched.nameCouncil && formikInputGroup.errors.nameCouncil} 
                                                />
                                            </div>
                                            <div className='mb-5'>
                                                <InputCustom
                                                    id={"zoomCouncil"}
                                                    label="Địa điểm bảo vệ hội đồng"
                                                    name={"zoomCouncil"}
                                                    value={formikInputGroup.values.zoomCouncil} 
                                                    onChange={formikInputGroup.handleChange}
                                                    onBlur={formikInputGroup.handleBlur}
                                                    isError={formikInputGroup.touched.zoomCouncil && Boolean(formikInputGroup.errors.zoomCouncil)} 
                                                    errorMessage={formikInputGroup.touched.zoomCouncil && formikInputGroup.errors.zoomCouncil} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-8">
                                        <div className="mx-2">
                                        <Button variant="outlined" onClick={()=>{
                                            setOpenModalInputCouncil(false);
                                            formikInputGroup.resetForm();
                                        }}>Đóng</Button>
                                        </div>
                                        <div>
                                            <Button variant="contained" type="submit">{councilSelected?.councilId ? "Chỉnh sửa" :"Thêm mới"}</Button>
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
                                    Thông báo xác nhận xóa nhóm hội đồng
                                </div>
                            </div>
                            <div className={``}>
                                <div className="flex justify-center">
                                    <span className="text-xl text-center font-medium">Bạn có muốn xóa nhóm hội đồng {councilSelected.councilName} ?</span>
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
                    

                    
            </div>
    );
}

export default CouncilSemester;