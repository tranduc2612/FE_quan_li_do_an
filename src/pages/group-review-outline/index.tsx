import { Button, MenuItem, Modal, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { Account, File } from 'mdi-material-ui';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import BoxWrapper from '~/components/BoxWrap';
import HeaderPageTitle from '~/components/HeaderPageTitle';
import InputSelectCustom from '~/components/InputSelectCustom';
import LoadingData from '~/components/LoadingData';
import RenderStatusProject from "~/components/RenderStatusProject";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { getTeaching } from '~/services/councilApi';
import { getGroupReview, getListProjectByGroupReview, getTeachingByGroupReview } from "~/services/groupReviewOutlineApi";
import { getListSemester } from '~/services/semesterApi';
import { IProject } from '~/types/IProjectType';
import { IResponse } from '~/types/IResponse';
import { ISemester } from '~/types/ISemesterType';
import { ITeacher } from "~/types/ITeacherType";
import { ITeaching } from '~/types/ITeachingType';


const validationSchema = yup.object({
    score: yup
    .string()
    .required('Điểm không được để trống')
    // .min(0)
    // .max(10),
    .matches(/^(10(\,0+)?|[0-9](\,[0-9]+)?)$/, "Điểm không hợp lệ"),
    comment: yup
    .string()
});

function TeacherGroupReview() {
    const [rows,setRows] = useState<any>([]);
    const info = useAppSelector(inforUser);
    const [detailTeaching,setDetailTeaching] = useState<ITeaching>();
    const [selectedProject,setSelectedProject] = useState<any>();
    const navigate = useNavigate();
    const apiRef = useGridApiRef();
    const apiRefTeacher = useGridApiRef();
    const [semesterOption,setSemesterOption] = useState<ISemester[]>([])
    const [loadingData,setLoadingData] = useState(false);
    const [modalTeachingInGroup,setModalTeachingInGroup] = useState(false);
    const [teachingInGroup,setTeachingInGroup] = useState<any>();
    const formik = useFormik({
        initialValues: {
            semester:"",
            groupId:""
        },
        validationSchema: validationSchema,
        onSubmit: (values,{setSubmitting}) => {

        },
    });

    

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
                            if(row?.userName){
                                navigate(`/profile/${row?.userName}`);
                            }
                    }}>
                        <Tooltip title="Trang cá nhân">
                            <Account />
                        </Tooltip>
                    </div>

                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-yellow-500" onClick={(e)=>{
                            e.stopPropagation();
                            if(row?.userName){
                                navigate(`/outline/${row?.userName}`);
                            }
                    }}>
                        <Tooltip title="Chi tiết đề cương">
                            <File />
                        </Tooltip>
                    </div>
                    
                </>
            }
        },
        {
            field: 'studentCode',
            headerName: 'Mã sinh viên',
            width: 200,
            editable: false,
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            width: 200,
            editable: false,
        },
        {
            field: 'nameProject',
            headerName: 'Tên đề tài',
            width: 200,
            editable: false,
            renderCell: ({row}) => row?.nameProject ? <span>{row?.nameProject}</span> : <span className="text-red-600">Chưa đăng ký đề tài</span>,
        },
        
        {
            field: 'projectOutline',
            headerName: 'Trạng thái đề cương',
            width: 250,
            editable: true,
            renderCell: ({row})=>{
                return <>{row?.projectOutline ? <span className="text-green-600">Đã đăng ký</span> :<span className="text-red-600">Chưa đăng ký</span>}</>
            }
        },
        {
            field: 'statusProject',
            headerName: 'Trạng thái đồ án',
            width: 150,
            editable: false,
            renderCell:({row})=><RenderStatusProject code={row?.statusProject} />
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
            field: 'email',
            headerName: 'Email',
            width: 200,
            editable: true,
        },
        {
            field: 'phone',
            headerName: 'Số điện thoại',
            width: 160,
            editable: true,
        },
    ]


    useEffect(()=>{
        // hanleFetchApi();
        if(formik.values.semester.length > 0){
            handleFetchApiTeaching();
        }

    },[formik.values.semester])

    useEffect(()=>{
        handleFetchApiSemesterOption();
    },[])

    const hanleFetchApiProjects = async (idGroup?: string) => {
            setLoadingData(true)
            await getListProjectByGroupReview({
                semesterId: formik.values.semester,
                groupReviewOutlineId: idGroup
            })
            .then((res:IResponse<IProject[]>)=>{
                if(res.success && res.returnObj.length > 0){
                    const newMap = res.returnObj.map((data:IProject,index:any)=>{
                        return {
                          id: index+1,
                          ...data,
                          ...data?.userNameNavigation,
                          ...data?.projectOutline
                        }
                    })

                    console.log(newMap)
                    setRows(newMap)
                }else{
                    setRows([])
                }
                setLoadingData(false)
            })
            .catch((err)=>{
                console.log(err)
            })
            .finally(()=>{
                setLoadingData(false)
            }) 
    }

    const handleFetchApiTeaching = async () =>{
        getTeaching(info?.userName, formik.values.semester)
        .then((res:IResponse<ITeaching>)=>{
            if(res.returnObj){
                const detail = res.returnObj;
                setDetailTeaching(detail);
                console.log(res)
                if(detail.groupReviewOutlineId){
                    hanleFetchApiProjects(detail.groupReviewOutlineId);
                    getTeachingByGroupReview(detail.groupReviewOutlineId)
                    .then(res=>{
                        if(res.returnObj){
                            const mapper = res?.returnObj.map((item,index)=>{
                                return {
                                    id: index+1,
                                    ...item,
                                    ...item?.userNameTeacherNavigation
                                }
                            })
                            setTeachingInGroup(mapper)
                        }else{
                            setTeachingInGroup([])
                        }
                    })
                    .catch(res=>{

                    })
                }else{
                    setRows([])
                }
                
            }
        })
    }

    const handleFetchApiSemesterOption = () =>{
        getListSemester(
            {
                semesterId: "",
                nameSemester: ""
            }
        )
        .then((res:IResponse<ISemester[]>)=>{
            if(res.success && res.returnObj && res.returnObj.length > 0){
                formik.values.semester = res.returnObj[0].semesterId ? res.returnObj[0].semesterId : "";
                setSemesterOption(res.returnObj);
            }
        })
    }
    

    return (
        <>
            <HeaderPageTitle pageName="Nhóm xét duyệt" />
            <BoxWrapper className=''>
                <div className="p-4">
                <h2 className={"font-bold text-primary-blue text-xl mb-10"}>
                    Nhóm xét duyệt
                </h2>
                <div className="grid grid-cols-3 mb-5">
                    <div className="col-span-1">
                        <InputSelectCustom
                            id={"semester"}
                            name={"semester"}
                            onChange={formik.handleChange}
                            value={formik.values.semester}
                            placeholder="Học kỳ"
                            label="Học kỳ"
                            onBlur={undefined}
                        >
                            {
                                semesterOption && semesterOption.map((x)=>{
                                    return <MenuItem key={x.semesterId} value={x.semesterId}>{x.nameSemester}</MenuItem>
                                })
                            }
                        </InputSelectCustom>
                    </div>
                </div>
                <div className={"grid grid-cols-6"}>
                    <div className={"col-span-6 my-1"}>
                        <b>Tên nhóm xét duyệt:</b> <span className={"text-text-color"}>{detailTeaching?.groupReviewOutline?.nameGroupReviewOutline}</span> 
                    </div>
                </div>
                
                {
                    loadingData ? <LoadingData /> : 
                    <>
                        { 
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
                                    rows={rows}
                                    columns={columns}
                                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                    onCellClick={({row})=>{
                                        
                                    }}
                                    initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                    }}
                                    getRowHeight={() => 'auto'}
                                    
                                    pageSizeOptions={[10]}
                                    slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                                <GridToolbarColumnsButton />
                                                <GridToolbarFilterButton  />
                                                <Button variant='text' startIcon={<Account />} onClick={()=>{
                                                    setModalTeachingInGroup(true)
                                                }}>
                                                    Danh sách giảng viên trong nhóm
                                                </Button>
                                        </GridToolbarContainer></> }}
                                    slotProps={{
                                        toolbar: {
                                            printOptions: { disableToolbarButton: true },
                                            csvOptions: { disableToolbarButton: true },
                                        }}
                                    }
                                />
                            </div>
                        </div>
                        }      
                    </>
                }
                </div>
            </BoxWrapper>

            <Modal
                        open={modalTeachingInGroup}
                        onClose={()=>setModalTeachingInGroup(false)}
                        aria-labelledby="modal-modal-title-mentor-assign"
                        aria-describedby="modal-modal-description-mentor-assign"
                    >
                        <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                            Danh sách giảng viên trong nhóm xét duyệt
                        </h2>
                            <div className="mt-5">
                                {
                                    loadingData ? <LoadingData /> : 
                                    <DataGrid
                                    apiRef={apiRefTeacher}
                                    rows={teachingInGroup}
                                    loading={loadingData}
                                    columns={columnsTeacher}
                                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                page: 0, 
                                                pageSize: 5 
                                            },
                                        },
                                    }}
                                    slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                        <GridToolbarColumnsButton />
                                        <GridToolbarFilterButton  />
                                    </GridToolbarContainer></> }}
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
                                        setModalTeachingInGroup(false)
                                    }}
                                    >Đóng</Button>
                                </div>

                                
                            </div>
                            
                        </div>
                    </Modal>
        </>
    );
}

export default TeacherGroupReview;