import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, MenuItem, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { Account, BookClock, Download, DownloadBox, MessageDraw } from 'mdi-material-ui';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import BoxWrapper from '~/components/BoxWrap';
import HeaderPageTitle from '~/components/HeaderPageTitle';
import InputSelectCustom from '~/components/InputSelectCustom';
import LoadingData from '~/components/LoadingData';
import RenderStatusProject from '~/components/RenderStatusProject';
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { getListProjectByUsernameMentor } from '~/services/projectApi';
import { getListSemester } from '~/services/semesterApi';
import { IProject } from '~/types/IProjectType';
import { IResponse } from '~/types/IResponse';
import { ISemester } from '~/types/ISemesterType';
import { formatDateTypeDateOnly } from '~/ultis/common';


const validationSchema = yup.object({
    groupReviewOutlineId: yup
      .string()
      .required('Mã nhóm xét duyệt'),
      nameGroupReviewOutline: yup
      .string()
      .required('Tên nhóm xét duyệt'),

  });



function ManageStudentMentor() {
    const [rows,setRows] = useState<any>([]);
    const info = useAppSelector(inforUser);
    const navigate = useNavigate();
    const {semesterId} = useParams();
    const apiRef = useGridApiRef();
    const [total, setTotal] = useState(0);
    const [semesterOption,setSemesterOption] = useState<ISemester[]>([])
    const [loadingData,setLoadingData] = useState(true);
    const initialData = {
        semester: semesterId
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
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Chức năng',
            width: 180,
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
                    {
                        row?.hashKeyMentor &&
                        <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-lime-600" onClick={(e)=>{
                                e.stopPropagation();
                                navigate(`/review-mentor/${row?.hashKeyMentor || "false"}`);
                        }}>
                            <Tooltip title="Đánh giá">
                                <MessageDraw />
                            </Tooltip>
                        </div>
                    }

                    {
                        row?.nameFileFinal && 
                        <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-rose-600" onClick={(e)=>{
                            e.stopPropagation();
                            navigate(`/review-mentor/${row?.hashKeyMentor || "false"}`);
                        }}>
                            <Tooltip title="Báo cáo tổng kết">
                                <DownloadBox />
                            </Tooltip>
                        </div>
                    }

                </>
            }
        },
        {
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 300,
            editable: false,
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
            field: 'dob',
            headerName: 'Ngày sinh',
            width: 100,
            editable: false,
            renderCell: ({row})=>{
                return <>{formatDateTypeDateOnly(row?.dob)}</>
            }
        },
        {
            field: 'scoreMentor',
            headerName: 'Điểm giáo viên hướng dẫn',
            width: 200,
            editable: false,
            align:"center"
        },
        // {
        //     field: 'scoreCommentator',
        //     headerName: 'Điểm giáo viên phẩn biện',
        //     width: 200,
        //     editable: false,
        //     align:"center"
        // },
        // {
        //     field: 'scoreFinal',
        //     headerName: 'Điểm tổng kết',
        //     width: 200,
        //     editable: false,
        //     align:"center"

        // },
        {
            field: 'projectOutline',
            headerName: 'Trạng thái đề cương',
            width: 250,
            editable: false,
            renderCell: ({row})=>{
                return <>{row?.projectOutline ? <span className="text-green-600">Đã đăng ký</span> :<span className="text-red-600">Chưa đăng ký</span>}</>
            }
        },
        {
            field: 'nameFileFinal',
            headerName: 'Trạng thái báo cáo',
            width: 250,
            editable: false,
            renderCell: ({row})=>{
                return <>{row?.nameFileFinal ? <span className="text-green-600">Đã nộp</span> :<span className="text-red-600">Chưa nộp</span>}</>
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
        if(formik.values.semester){
            navigate(`/manager-student-mentor/${formik.values.semester}`);
        }
        hanleFetchApi();
    },[formik.values.semester])

    useEffect(()=>{
        handleFetchApiSemesterOption();
    },[])

    const hanleFetchApi = async () => {
        if(formik.values.semester !== undefined){
            setLoadingData(true)
            getListProjectByUsernameMentor(info?.userName, formik.values.semester)
            .then((res:IResponse<IProject[]>)=>{
                if(res.success && res.returnObj.length > 0){
                    const newMap = res.returnObj.map((data:IProject,index:any)=>{
                        return {
                          id: index+1,
                          ...data,
                          ...data?.userNameNavigation
                        }
                    })
                    setRows(newMap)
                    setTotal(res.returnObj.length)
                }else{
                    setRows([])
                    setTotal(0)
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
    }

    const handleFetchApiSemesterOption = () =>{
        getListSemester(
            {
                semesterId: formik.values.semester,
                nameSemester: ""
            }
        )
        .then((res:IResponse<ISemester[]>)=>{
            console.log(res)
            if(res.success && res.returnObj && res.returnObj.length > 0){
                // formik.values.semester = res.returnObj[0].semesterId ? res.returnObj[0].semesterId : "";
                setSemesterOption(res.returnObj);
            }
        })
    }
    

    return (
        <>
            <HeaderPageTitle pageName="Sinh viên hướng dẫn" />
            <BoxWrapper className=''>
                <div className="p-4">
                <h2 className={"font-bold text-primary-blue text-xl mb-10"}>
                    Quản lý sinh viên hướng dẫn
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
                {
                    loadingData ? <LoadingData /> : 
                    <>
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
                                            rows={rows}
                                            columns={columns}
                                            rowCount={total}
                                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                            onCellClick={({row})=>{
                                                // const idSemester = id;
                                                // const idGroup = row?.groupReviewOutlineId;
                                                
                                            }}
                                            initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 5 },
                                            },
                                            }}
                                            
                                            pageSizeOptions={[10]}
                                            slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                                        <GridToolbarColumnsButton />
                                                        <GridToolbarFilterButton  />
                                                        <Button startIcon={<Download />}>Excel</Button>
                                                        <Button variant='text' startIcon={<BookClock />} onClick={()=>{
                                                            navigate("/schedule-week/"+formik.values.semester)
                                                        }}>
                                                        Báo cáo tuần
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
        </>
    );
}

export default ManageStudentMentor;