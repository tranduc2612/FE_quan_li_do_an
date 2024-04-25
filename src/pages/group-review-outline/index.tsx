import { MenuItem, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
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
import { getListProjectByGroupReview } from "~/services/groupReviewOutlineApi";
import { getListSemester } from '~/services/semesterApi';
import { IProjecType } from '~/types/IProjectType';
import { IResponse } from '~/types/IResponse';
import { ISemester } from '~/types/ISemesterType';
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
    const [semesterOption,setSemesterOption] = useState<ISemester[]>([])
    const [loadingData,setLoadingData] = useState(false);
    const [openModal,setOpenModal] = useState(false);

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
            .then((res:IResponse<IProjecType[]>)=>{
                if(res.success && res.returnObj.length > 0){
                    const newMap = res.returnObj.map((data:IProjecType,index:any)=>{
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
                    hanleFetchApiProjects(detail.groupReviewOutlineId)
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
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                    }}
                                    getRowHeight={() => 'auto'}
                                    
                                    pageSizeOptions={[10]}
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
                                />
                            </div>
                        </div>
                        }      
                    </>
                }
                </div>
            </BoxWrapper>
        </>
    );
}

export default TeacherGroupReview;