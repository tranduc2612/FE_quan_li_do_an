import { Button, MenuItem, Modal, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { Account, BookClock, ClipboardEdit, Download } from 'mdi-material-ui';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BoxWrapper from '~/components/BoxWrap';
import HeaderPageTitle from '~/components/HeaderPageTitle';
import InputCustom from "~/components/InputCustom";
import InputSelectCustom from '~/components/InputSelectCustom';
import LoadingData from '~/components/LoadingData';
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { getListProjectCouncil, getTeaching } from '~/services/councilApi';
import { getListSemester } from '~/services/semesterApi';
import { IProjecType } from '~/types/IProjectType';
import { IResponse } from '~/types/IResponse';
import { ISemester } from '~/types/ISemesterType';
import { ITeaching } from '~/types/ITeachingType';
import { formatDateTypeDateOnly, renderRoleInCouncil } from '~/ultis/common';
import * as yup from 'yup';
import { ScoreType, updateScore } from "~/services/projectApi";
import { toast } from "react-toastify";
import ExpandableCell from "~/components/TableEdit.tsx/ExpandableCell";


const validationSchema = yup.object({
    score: yup
    .string()
    .required('Điểm không được để trống')
    .matches(/^(10(\.0{1,2})?|[0-9](\.[0-9]{1,2})?)$/, "Điểm không hợp lệ"),
    comment: yup
    .string()
});

function TeacherCouncil() {
    const [rows,setRows] = useState<any>([]);
    const info = useAppSelector(inforUser);
    const [detailTeaching,setDetailTeaching] = useState<ITeaching>();
    const [selectedProject,setSelectedProject] = useState<any>();
    const navigate = useNavigate();
    const apiRef = useGridApiRef();
    const [semesterOption,setSemesterOption] = useState<ISemester[]>([])
    const [loadingData,setLoadingData] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const initialData = {
        semester:"",
        score: "",
        comment:"",
        role: ""
    }
    const formik = useFormik({
        initialValues: initialData,
        validationSchema: validationSchema,
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
                            setSelectedProject(row);
                            if(detailTeaching?.positionInCouncil){
                                formik.errors.comment = "";
                                formik.errors.score = "";
                                formik.values.role = detailTeaching?.positionInCouncil
                                if(detailTeaching?.positionInCouncil === "CT"){
                                    formik.values.score = row?.scoreCt || "0",
                                    formik.values.comment = row?.commentCt || ""
                                }
                                if(detailTeaching?.positionInCouncil === "TK"){
                                    formik.values.score = row?.scoreTk || "0",
                                    formik.values.comment = row?.commentTk || ""
                                }
                                if(detailTeaching?.positionInCouncil === "UV1"){
                                    formik.values.score = row?.scoreUv1 || "0",
                                    formik.values.comment = row?.commentUv1 || ""
                                }
                                if(detailTeaching?.positionInCouncil === "UV2"){
                                    formik.values.score = row?.scoreUv2 || "0",
                                    formik.values.comment = row?.commentUv2 || ""
                                }
                                if(detailTeaching?.positionInCouncil === "UV3"){
                                    formik.values.score = row?.scoreUv3 || "0",
                                    formik.values.comment = row?.commentUv3 || ""
                                }
                                setOpenModal(true);
                            }
                    }}>
                        <Tooltip title="Cập nhật điểm">
                            <ClipboardEdit />
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
            field: 'scoreCt',
            headerName: 'Điểm chủ tịch',
            width: 100,
            editable: false,
            align: 'center'
        },
        {
            field: 'commentCt',
            headerName: 'Đánh giá chủ tịch',
            width: 300,
            editable: false,
            renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
        },
        {
            field: 'scoreTk',
            headerName: 'Điểm thư ký',
            width: 100,
            editable: false,
            align: 'center'
        },
        {
            field: 'commentTk',
            headerName: 'Đánh giá thư ký',
            width: 300,
            editable: false
        },
        {
            field: 'scoreUv1',
            headerName: 'Điểm ủy viên 1',
            width: 100,
            editable: false,
            align: 'center'
        },
        {
            field: 'commentUv1',
            headerName: 'Đánh giá ủy viên 1',
            width: 300,
            editable: false
        },
        {
            field: 'scoreUv2',
            headerName: 'Điểm ủy viên 2',
            width: 100,
            editable: false,
            align: 'center'

        },
        {
            field: 'commentUv2',
            headerName: 'Đánh giá ủy viên 2',
            width: 300,
            editable: false
        },
        {
            field: 'scoreUv3',
            headerName: 'Điểm ủy viên 3',
            width: 100,
            editable: false,
            align: 'center'
        },
        {
            field: 'commentUv3',
            headerName: 'Đánh giá ủy viên 3',
            width: 300,
            editable: false
        },
        // {
        //     field: 'scoreMentor',
        //     headerName: 'Điểm giáo viên hướng dẫn',
        //     width: 200,
        //     editable: false
        // },
        // {
        //     field: 'scoreCommentator',
        //     headerName: 'Điểm giáo viên phẩn biện',
        //     width: 200,
        //     editable: false
        // },
        {
            field: 'scoreFinal',
            headerName: 'Điểm tổng kết',
            width: 200,
            editable: false
        },
        
        // {
        //     field: 'projectOutline',
        //     headerName: 'Trạng thái đề cương',
        //     width: 250,
        //     editable: true,
        //     renderCell: ({row})=>{
        //         return <>{row?.projectOutline ? <span className="text-green-600">Đã đăng ký</span> :<span className="text-red-600">Chưa đăng ký</span>}</>
        //     }
        // },
        {
            field: 'statusProject',
            headerName: 'Trạng thái đồ án',
            width: 150,
            editable: false
        },
    ];
    useEffect(()=>{
        // hanleFetchApi();
        handleFetchApiTeaching();

    },[formik.values.semester])

    useEffect(()=>{
        handleFetchApiSemesterOption();
    },[])

    const hanleFetchApiProjectCouncil = async (idCouncil?: string) => {
            // setLoadingData(true)
            await getListProjectCouncil({
                semesterId: formik.values.semester
            })
            .then((res:IResponse<IProjecType[]>)=>{
                console.log(res.success)
                if(res.success && res.returnObj.length > 0){
                    const newMap = res.returnObj.filter(x=>x?.councilId == idCouncil).map((data:IProjecType,index:any)=>{
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
                if(detail.councilId){
                    hanleFetchApiProjectCouncil(detail.councilId)
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
            <HeaderPageTitle pageName="Hội đồng bảo vệ" />
            <BoxWrapper className=''>
                <div className="p-4">
                <h2 className={"font-bold text-primary-blue text-xl mb-10"}>
                    Hội đồng bảo vệ
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
                        <b>Tên hội đồng:</b> <span className={"text-text-color"}>{detailTeaching?.council?.councilName}</span> 
                    </div>
                    <div className={"col-span-6 my-1"}>
                        <b>Địa điểm bảo vệ:</b> <span className={"text-text-color"}>{detailTeaching?.council?.councilZoom}</span> 
                    </div>
                    <div className={"col-span-6 my-1"}>
                        <b>Vai trò:</b> <span className={"text-text-color"}>{renderRoleInCouncil(detailTeaching?.positionInCouncil)}</span> 
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

            <Modal
                open={openModal}
                onClose={()=>setOpenModal(false)}
                aria-labelledby="modal-modal-title-delete"
                aria-describedby="modal-modal-description-delete"
            >
                <div className="p-5 rounded-xl bg-white w-2/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="title mb-5" >
                        <div className="text-2xl text-center text-primary-blue font-bold">
                            Cập nhật điểm của sinh viên
                        </div>
                    </div>
                    <div className="grid grid-cols-1 info mb-10" >
                        <div className="col-span-1 m-2 text-primary-blue font-bold">
                            Thông tin sinh viên
                        </div>
                        <div className={"col-span-1 m-2"}>
                            <b>Họ tên:</b> <span className={"text-text-color"}>{selectedProject?.fullName}</span>
                        </div>
                        <div className={"col-span-1 m-2"}>
                            <b>Mã sinh viên:</b> <span className={"text-text-color"}>{selectedProject?.studentCode}</span>
                        </div>
                        <div className={"col-span-1 m-2"}>
                            <b>Tên đề tài:</b> {selectedProject?.nameProject ? <span>{selectedProject?.nameProject}</span> : <span className="text-red-600">Chưa đăng ký đề tài</span>}
                        </div>
                        <div className={"col-span-1 m-2"}>
                            <b>Cập nhật điểm dưới vai trò là:</b> <span className={"text-text-color"}>{renderRoleInCouncil(detailTeaching?.positionInCouncil)}</span>
                        </div>
                        {/* Cập nhật điểm sinh viên <span className="text-primary-blue font-bold underline">{selectedProject?.fullName}</span> 
                        mã sinh viên <span className="text-primary-blue font-bold underline">{selectedProject?.studentCode}</span> 
                        dưới vai trò <span className="text-primary-blue font-bold underline">{renderRoleInCouncil(detailTeaching?.positionInCouncil)}</span>  */}
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className={"mb-4"}>
                            <InputCustom
                                id="score" 
                                label={"Điểm"} 
                                name={"score"}
                                placeholder="Nhập điểm từ 0 - 10"
                                value={formik.values.score} 
                                isError={formik.touched.score && Boolean(formik.errors.score)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.score && formik.errors.score} 
                            />
                        </div>

                        <div className={"mb-4"}>
                            <InputCustom
                                id="comment" 
                                label={"Nhận xét"} 
                                name={"comment"}
                                value={formik.values.comment}
                                multiline={true} 
                                isError={formik.touched.comment && Boolean(formik.errors.comment)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.comment && formik.errors.comment} 
                            />
                        </div>

                        <div className="mt-5 flex justify-end" >
                        <div className="mx-3">
                            <Button variant="outlined" onClick={()=>{
                                setOpenModal(false)
                                setSelectedProject({})
                            }}
                            >Đóng</Button>
                        </div>
                            <Button variant="contained" type="submit" onClick={()=>{
                                const req:ScoreType = {
                                    userName: selectedProject?.userName,
                                    semesterId: formik.values.semester,
                                    role: formik.values.role,
                                    score: formik.values.score,
                                    comment: formik.values.comment
                                } 
                                updateScore(req)
                                .then((res:IResponse<any>)=>{
                                    if(res.success){
                                        toast.success(res.msg)
                                        setOpenModal(false);
                                        handleFetchApiTeaching();
                                    }else{
                                        toast.error(res.msg)                                   
                                    }
                                })
                            }}>
                                Lưu
                            </Button>
                        </div>
                    </form>
                    
                    
                </div>
            </Modal>
        </>
    );
}

export default TeacherCouncil;