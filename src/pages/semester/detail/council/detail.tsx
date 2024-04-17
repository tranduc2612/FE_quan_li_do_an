import AddIcon from '@mui/icons-material/Add';
import { Button, Modal, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel, GridRowParams, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { ChevronLeft, Download, Note, Pencil, Printer } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import LoadingData from "~/components/LoadingData";
import { IResponse } from "~/types/IResponse";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BoxWrapper from "~/components/BoxWrap";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { AssignCouncilProject, AssignCouncilTeaching, assginCouncilToProject, assginCouncilToTeaching, excelListProjectCouncil, getCouncil, getListProjectCouncil, getListTeachingNotInCouncil } from "~/services/councilApi";
import { assignCommentator } from '~/services/projectApi';
import { ICouncil } from "~/types/ICouncil";
import { IProjecType } from '~/types/IProjectType';
import { ITeaching } from "~/types/ITeachingType";
import RenderStatusProject from '~/components/RenderStatusProject';


function DetailCouncil() {
    const [lstProjectInCouncil,setLstProjectInCouncil] = useState<any>([]);
    const [lstProjectNotInCouncil,setLstProjectNotInCouncil] = useState<any>([]);
    const {idCouncil,idSemester} = useParams();
    const info = useAppSelector(inforUser);
    const navigate = useNavigate();
    const [councilDetail,setCouncilDetail] = useState<ICouncil>({
        councilId: "",
        councilName: "",
        councilZoom: "",
        createdBy: "",
        createdDate: new Date(),
        isDelete: 0,
        semesterId: "",
    });
    const [totalProjectNotInCouncil, setTotalProjectNotInCouncil] = useState(0);
    const [totalProjectInCouncil, setTotalProjectInCouncil] = useState(0);

    const apiRefStudent = useGridApiRef();
    const [lstTeachingInCouncil,setLstTeachingInCouncil] = useState<ITeaching[]>([]);
    const [selectedTeacher,setSelectdTeacher] = useState<ITeaching>();
    const [openModalAddStudent,setOpenModalAddStudent] = useState(false);
    const [rowsStudentChecked,setRowsStudentChecked] = useState<any>([]);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
        pageMax: -1
    });
    const [paginationModelStudent, setPaginationModelStudent] = useState({
        pageSize: 5,
        page: 0,
        pageMax:-1
    });    
    const [openModalAssignToCouncil,setOpenModalAssignToCouncil] = useState(false);
    const [openModalAssignCommentator,setOpenModalAssignCommentator] = useState(false);

    const [rowsTeacher,setRowsTeacher] = useState<ITeaching[]>([]);
    const [totalTeacher, setTotalTeacher] = useState(0);
    const apiRefTeacher = useGridApiRef();

    const [UV1,setUV1] = useState<ITeaching | null>(null)
    const [UV2,setUV2] = useState<ITeaching | null>(null)
    const [UV3,setUV3] = useState<ITeaching | null>(null)
    const [TK,setTK] = useState<ITeaching | null>(null)
    const [CT,setCT] = useState<ITeaching | null>(null)
    const [selectedRole,setSelectedRole] = useState<"CT" | "TK" | "UV1" | "UV2" | "UV3">();
    const [selectedStudent,setSelectedStudent] = useState<any>()
    const apiRef = useGridApiRef();
    const [loadingData,setLoadingData] = useState(false);

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
            headerName: 'Chức năng',
            width: 200,
            editable: false,
            renderCell:({row})=>{
                console.log(row)
                return <>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-blue-500" onClick={(e)=>{
                            e.stopPropagation();
                            setOpenModalAssignCommentator(true);
                            setSelectdTeacher({})
                            setSelectedStudent(row)
                    }}>
                        <Tooltip title="Gán giảng viên phản biện">
                            <PersonAddIcon />
                        </Tooltip>
                    </div>
                    <div className="cursor-pointer p-3 hover:bg-slate-300 rounded-full text-yellow-500" onClick={(e)=>{
                            e.stopPropagation();
                            if(row?.userName){
                                navigate(`/outline/${row?.userName}`);
                            }
                    }}>
                        <Tooltip title="Chi tiết đề cương">
                            <Note />
                        </Tooltip>
                    </div>
                    
    
                </>
            }
        },
        {
            field: 'studentCode',
            headerName: 'Mã sinh viên',
            width: 150,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            width: 200,
            editable: true,
        },
        {
            field: 'nameProject',
            headerName: 'Tên đề tài',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.nameProject ? row?.nameProject : <span className="text-red-600">Chưa đăng ký</span>}  
                </>
            }
        },
        {
            field: 'scoreCt',
            headerName: 'Chủ tịch',
            width: 100,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreCt?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'scoreTk',
            headerName: 'Thư ký',
            width: 100,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreTk?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'scoreUv1',
            headerName: 'UV1',
            width: 100,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreUv1?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'scoreUv2',
            headerName: 'UV2',
            width: 100,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreUv2?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'scoreUv3',
            headerName: 'UV3',
            width: 100,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreUv3?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'scoreMentor',
            headerName: 'GVHD',
            width: 80,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreMentor?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'scoreCommentator',
            headerName: 'GVHD',
            width: 80,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreCommentator?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'scoreFinal',
            headerName: 'Tổng kết',
            width: 180,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.scoreFinal?.toString()?.replace(".",",")}  
                </>
            }
        },
        {
            field: 'statusProject',
            headerName: 'Trạng thái đồ án',
            width: 250,
            editable: true,
            renderCell:({row})=><RenderStatusProject code={row?.statusProject} />
        },
        {
            field: 'userNameMentor',
            headerName: 'Giảng viên hướng dẫn',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <div onClick={(e)=>{
                    e.stopPropagation();
                    if(row?.userNameMentor){
                        navigate("/profile/"+row?.userNameMentor)
                    }
                }}>
                    {row?.userNameMentor ? row?.userNameMentor : <span className="text-red-600">Chưa được gán</span>}  
                </div>
            }
        },
        {
            field: 'userNameCommentator',
            headerName: 'Giảng viên phản biện',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.userNameCommentator ? row?.userNameCommentator : <span className="text-red-600">Chưa được gán</span>}  
                </>
            }
        },
        {
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.semesterId}  
                </>
            }
        },
    ];

    const columnsProject: GridColDef[] =[
        {
            field: 'id',
            headerName: 'STT',
            width: 80,
            maxWidth: 60,
            flex: 1,
            editable: true,
        },
        {
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {idSemester}  
                </>
            }
        },
        {
            field: 'studentCode',
            headerName: 'Mã sinh viên',
            width: 150,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            width: 200,
            editable: true,
        },
        {
            field: 'nameProject',
            headerName: 'Tên đề tài',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.nameProject ? row?.nameProject : <span className="text-red-600">Chưa đăng ký</span>}  
                </>
            }
        },
        {
            field: 'statusProject',
            headerName: 'Trạng thái đồ án',
            width: 200,
            editable: true,
            renderCell:({row})=><RenderStatusProject code={row?.statusProject} />
        },
        {
            field: 'userNameMentor',
            headerName: 'Mã giảng viên hướng dẫn',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.userNameMentor ? row?.userNameMentor : <span className="text-red-600">Chưa được gán</span>}  
                </>
            }
        },
        {
            field: 'councilName',
            headerName: 'Tên hội đồng',
            width: 250,
            editable: true,
            renderCell:({row})=>{
                return <>
                    {row?.councilName ? row?.councilName :<span className="text-red-600">Chưa được gán</span>}  
                </>
            }
        },
        
    ]

    const columnsTeacher: GridColDef[] =[
        {
            field: 'id',
            headerName: 'STT',
            width: 80,
            maxWidth: 60,
            flex: 1,
            editable: false,
        },
        {
            field: 'userName',
            headerName: 'Tên tài khoản',
            width: 250,
            editable: false,
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            width: 200,
            editable: false,
        },
        {
            field: 'education',
            headerName: 'Học vị',
            width: 160,
            editable: false,
        },
        {
            field: 'councilId',
            headerName: 'Tên nhóm hội đồng',
            width: 200,
            editable: false,
            renderCell:({row})=>{
                return <>{row?.council  ? row?.council?.councilName: <span className="text-red-600">Chưa được gán</span>}</>
            }
        },
    ]
    useEffect(()=>{
        setLoadingData(true)
        Promise.all([hanleFetchApi(),handleFetchDetailCouncil(),handleFetchApiTeacherNotInCouncil()])
        .then((res)=>{
            setLoadingData(false)
        })
        .catch(()=>{

        })
        .finally(()=>{
            setLoadingData(false)

        })
    },[])


    const handleFetchDetailCouncil = async () =>{
        if(idCouncil){
            getCouncil(idCouncil)
            .then((res:IResponse<ICouncil>)=>{
                if(res.success && res.returnObj){
                    console.log(res)
                    setCouncilDetail(res.returnObj)
                    if(res.returnObj?.teachings){
                        const lstTeaching = res.returnObj?.teachings.map((data:any,index:any)=>{
                            return {
                              id: index+1,
                              ...data,
                              ...data?.userNameTeacherNavigation
                            }
                        });

                        console.log(lstTeaching)
                        setLstTeachingInCouncil([...lstTeaching])
                        const UV1 = lstTeaching.find(x=>x.positionInCouncil == "UV1");
                        if(UV1){
                            setUV1(UV1)
                        }
                        const UV2 = lstTeaching.find(x=>x.positionInCouncil == "UV2");
                        if(UV2){
                            setUV2(UV2)
                        }
                        const UV3 = lstTeaching.find(x=>x.positionInCouncil == "UV3");
                        if(UV3){
                            setUV3(UV3)
                        }
                        const TK = lstTeaching.find(x=>x.positionInCouncil == "TK");
                        if(TK){
                            setTK(TK)
                        }
                        const CT = lstTeaching.find(x=>x.positionInCouncil == "CT");
                        if(CT){
                            setCT(CT)
                        }
                    }
                }
            })
            .catch(()=>{

            })
        }
    }

    const hanleFetchApi = async () => {
        console.log(idSemester)
        if(idSemester){
            await getListProjectCouncil({
                semesterId: idSemester
            })
            .then((res:IResponse<IProjecType[]>)=>{
              console.log(res)
              if(res.success && res.returnObj) {
                const dataMap = res.returnObj;
                
                if(dataMap.length <= 0) {
                    setTotalProjectInCouncil(0)
                    setLstProjectInCouncil([])
                }else{
                    const newMap = dataMap.map((data:any,index:any)=>{
                        return {
                          id: index+1,
                          ...data,
                          ...data?.userNameNavigation,
                          ...data?.projectOutline,
                          ...data?.council
                        }
                    });
                    console.log(newMap,"sadkaksdkasd")
                    const lstInCouncil = [...newMap].filter(x=>x?.councilId == idCouncil);
                    const lstNotInCouncil = [...newMap].sort(function(a:any, b:any) {
                        if (a?.councilId === idCouncil && b?.councilId !== idCouncil) {
                          return -1; // a nằm trước b
                        }
                      
                        if (a?.councilId !== idCouncil && b?.councilId === idCouncil) {
                          return 1; // b nằm trước a
                        }
                      
                        return 0; // Giữ nguyên thứ tự ban đầu
                      })
                    console.log(lstNotInCouncil)
                    setLstProjectInCouncil([...lstInCouncil])
                    setTotalProjectInCouncil(lstInCouncil.length)
                    setLstProjectNotInCouncil([...lstNotInCouncil])
                    setTotalProjectNotInCouncil(lstNotInCouncil.length)
                    const checked = newMap.filter((item:any,index:any)=>{
                        if(item?.userNameNavigation?.userNameMentor){
                            console.log(item)
                        }
                        return item?.councilId == idCouncil
                    }).map((r:any,index) => r.id)
                    console.log(lstInCouncil)
                    setRowsStudentChecked([...checked])
                }
              }
            })
        }
        
    }

    const handleFetchApiTeacherNotInCouncil = async ()=>{
        setLoadingData(true)
        await getListTeachingNotInCouncil({
            semesterId:  idSemester
        })
        .then((res:IResponse<ITeaching[]>)=>{
            if(res.success && res.returnObj) {
                const dataMap = res.returnObj;
                
                if(dataMap.length <= 0) {
                    setTotalTeacher(0)
                    setRowsTeacher([])
                }else{
                    const newMap = dataMap.map((data:ITeaching,index:any)=>{
                        return {
                          ...data,
                          ...data?.groupReviewOutline,
                          ...data?.semester,
                          ...data?.userNameTeacherNavigation
                        }
                    }).filter(x=>x.status === "AUTH").
                    map((data:ITeaching,index:any)=>{
                        return {
                          id: index+1,
                          ...data
                        }
                    })
                    const totalItem = newMap.length;
                    setTotalTeacher(totalItem)
                    console.log(newMap)

                    setRowsTeacher([...newMap].filter(x=>x.positionInCouncil == null))
                }
              }
        })
        .finally(()=>{
            setLoadingData(false)
        })
    }


    const handlePaginationModelChangeTeacher = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModelStudent({
            ...paginationModelStudent,
            page:newPaginationModel.page
        })
    };

    const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModel({
            ...paginationModel,
            page:newPaginationModel.page
        })
    };

    return (
        <>
            <BoxWrapper className="">
                {loadingData ? <LoadingData /> : <>
                    <div className="p-4 pt-0">
                        <div className="mb-5">
                            <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                    Quay lại
                            </Button>
                        </div>
                        <h2 className={"font-bold text-primary-blue text-xl mb-4"}>
                            Chi tiết hội đồng
                        </h2>
                        {/* Chi tiết thông tin hội đồng */}
                        <div className={"grid grid-cols-8 mb-5"}>
                            <div className={"col-span-4 my-1"}>
                                <b>Tên hội đồng:</b> <span className={"text-text-color"}>{councilDetail?.councilName}</span> 
                            </div>
                            <div className={"col-span-4 my-1"}>
                                <b>Địa điểm bảo vệ:</b> <span className={"text-text-color"}>{councilDetail?.councilZoom}</span> 
                            </div>
                        </div>

                        <div className={"grid grid-cols-9 mb-5"}>
                            <div className={"col-span-3 my-2"}>
                                <b>Chủ tịch:</b> {CT ?
                                    <>
                                        <span onClick={()=>{
                                        navigate("/profile/"+CT?.userNameTeacher)
                                        }} className={"text-text-color cursor-pointer hover:underline hover:text-primary-blue"}>
                                            {CT?.userNameTeacherNavigation?.fullName}
                                        </span>
                                        <Pencil className='ms-2 text-primary-blue cursor-pointer'onClick={()=>{
                                            setSelectedRole("CT")
                                            setOpenModalAssignToCouncil(true)
                                            setSelectdTeacher({})
                                        }}/>
                                    </>  :
                                    <>
                                        <Button variant="text"
                                            onClick={()=>{
                                                setSelectedRole("CT")
                                                setOpenModalAssignToCouncil(true)
                                                setSelectdTeacher({})
                                            }}
                                        >Thêm giảng viên</Button>
                                    </> 
                                }
                            </div>
                            
                            <div className={"col-span-3 my-2"}>
                                <b>Thư ký:</b> {TK ?
                                <>
                                    <span onClick={()=>{
                                        navigate("/profile/"+TK?.userNameTeacher)
                                    }} className={"text-text-color cursor-pointer hover:underline hover:text-primary-blue"}>{TK?.userNameTeacherNavigation?.fullName}</span>  
                                    <Pencil className='ms-2 text-primary-blue cursor-pointer'onClick={()=>{
                                        setSelectedRole("TK")
                                        setOpenModalAssignToCouncil(true)
                                        setSelectdTeacher({})
                                    }}/>
                                </>
                                    :
                                    <>
                                    <Button variant="text"
                                    onClick={()=>{
                                        setSelectedRole("TK")
                                        setOpenModalAssignToCouncil(true)
                                        setSelectdTeacher({})
                                    }}
                                    >Thêm giảng viên</Button></> 
                                }
                            </div>
                            
                            <div className={"col-span-3 my-2"}>
                                <b>Ủy viên 1:</b> {UV1 ?
                                    <>
                                        <span onClick={()=>{
                                            navigate("/profile/"+UV1?.userNameTeacher)
                                        }} className={"text-text-color cursor-pointer hover:underline hover:text-primary-blue"}>{UV1?.userNameTeacherNavigation?.fullName}</span>  
                                        <Pencil className='ms-2 text-primary-blue cursor-pointer'onClick={()=>{
                                            setSelectedRole("UV1")
                                            setOpenModalAssignToCouncil(true)
                                            setSelectdTeacher({})
                                        }}/>
                                    </>
                                    :
                                    <><Button variant="text"
                                    onClick={()=>{
                                        setSelectedRole("UV1")
                                        setOpenModalAssignToCouncil(true)
                                        setSelectdTeacher({})
                                    }}
                                >Thêm giảng viên</Button></> 
                                }
                            </div>
                            
                            <div className={"col-span-3 my-2"}>
                                <b>Ủy viên 2:</b> {UV2 ?
                                    <>
                                        <span onClick={()=>{
                                            navigate("/profile/"+UV2?.userNameTeacher)
                                        }} className={"text-text-color cursor-pointer hover:underline hover:text-primary-blue"}>{UV2?.userNameTeacherNavigation?.fullName}</span>  

                                        <Pencil className='ms-2 text-primary-blue cursor-pointer'onClick={()=>{
                                            setSelectedRole("UV2")
                                            setOpenModalAssignToCouncil(true)
                                            setSelectdTeacher({})
                                        }}/>    
                                    </>
                                    :
                                    <><Button variant="text"
                                    onClick={()=>{
                                        setSelectedRole("UV2")
                                        setOpenModalAssignToCouncil(true)
                                        setSelectdTeacher({})
                                    }}
                                >Thêm giảng viên</Button></> 
                                }
                            </div>
                            
                            <div className={"col-span-3 my-2"}>
                                <b>Ủy viên 3:</b> {UV3 ?
                                    <>
                                        <span onClick={()=>{
                                            navigate("/profile/"+UV3?.userNameTeacher)
                                        }} className={"text-text-color cursor-pointer hover:underline hover:text-primary-blue"}>{UV3?.userNameTeacherNavigation?.fullName}</span>  
                                        <Pencil className='ms-2 text-primary-blue cursor-pointer'onClick={()=>{
                                            setSelectedRole("UV3")
                                            setOpenModalAssignToCouncil(true)
                                            setSelectdTeacher({})
                                        }}/>
                                    </>
                                    :
                                    <><Button variant="text"
                                    onClick={()=>{
                                        setSelectedRole("UV3")
                                        setOpenModalAssignToCouncil(true)
                                        setSelectdTeacher({})
                                    }}
                                >Thêm giảng viên</Button></> 
                                }
                            </div>
                        </div>

                        {/* Danh sách sinh viên trong hội đồng */}
                        
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
                                    checkboxSelection={false}
                                    rows={lstProjectInCouncil}
                                    columns={columns}
                                    // rowCount={totalProjectInCouncil}
                                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                    onPaginationModelChange={handlePaginationModelChange}
                                    onCellClick={({row})=>{
                                        if(row?.userName){
                                            navigate("/profile/"+row?.userName)
                                        }
                                    }}
                                    slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                        <GridToolbarColumnsButton />
                                        <GridToolbarFilterButton  />
                                        <Button variant="text" startIcon={<AddIcon />} onClick={()=>{
                                            setOpenModalAddStudent(true)
                                        }}>
                                            Thêm sinh viên vào hội đồng
                                        </Button>
                                        <Button variant="text" startIcon={<Download />} onClick={()=>{
                                            excelListProjectCouncil({
                                                semesterId: idSemester,
                                                councilId: idCouncil
                                            })
                                            .then((res:any)=>{
                                                const link = document.createElement('a');
                                                const fileName = 'BangDiem.xlsx';
                                                link.setAttribute('download', fileName);
                                                link.href = URL.createObjectURL(new Blob([res]));
                                                document.body.appendChild(link);
                                                link.click();
                                                link.remove();

                                            })
                                        }}>
                                            Xuất bảng điểm
                                        </Button>
                                    </GridToolbarContainer></> }}
                                    initialState={{
                                    pagination: {
                                        paginationModel: { page: paginationModel.page, pageSize: paginationModel.pageSize },
                                    },
                                    }}
                                    pageSizeOptions={[10]}
                                />
                            </div>
                        </div>
                    </div>
                </>}
            </BoxWrapper>
            <Modal
                open={openModalAddStudent}
                onClose={()=>setOpenModalAddStudent(false)}
                aria-labelledby="modal-modal-title-mentor-assign"
                aria-describedby="modal-modal-description-mentor-assign"
            >
                <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                    Thêm sinh viên vào hội đồng
                </h2>
                    <div className="mt-5">
                        {
                            loadingData ? <LoadingData /> : 
                            <DataGrid
                            apiRef={apiRefStudent}
                            rows={lstProjectNotInCouncil}
                            loading={loadingData}
                            columns={columnsProject}
                            rowCount={totalProjectNotInCouncil}
                            checkboxSelection={true}
                            isRowSelectable={(params: GridRowParams) => params.row?.councilId == idCouncil || !params.row?.councilId}
                            rowSelectionModel={rowsStudentChecked}
                            onRowSelectionModelChange={setRowsStudentChecked}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            onPaginationModelChange={handlePaginationModelChangeTeacher}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        page: paginationModelStudent.page, 
                                        pageSize: paginationModelStudent.pageSize 
                                    },
                                },
                            }}
                            slots={{ toolbar: GridToolbar }}
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
                                setOpenModalAddStudent(false)
                            }}
                            >Đóng</Button>
                        </div>
                        <Button variant="contained" onClick={()=>{
                            const lstUsername:string[] = [];
                            apiRefStudent.current.getSelectedRows().forEach((item)=>{
                                lstUsername.push(item?.userName.toString())
                            })
                            console.log(lstUsername)
                            const req: AssignCouncilProject ={
                                councilId: councilDetail.councilId,
                                usernameProjects: lstUsername,
                                semesterId: idSemester
                            }
                            assginCouncilToProject(req)
                            .then((res:IResponse<any>)=>{
                                if(res.success){
                                    toast.success(res.msg)
                                    hanleFetchApi();
                                }else{
                                    toast.error(res.msg)
                                }
                            })
                            .catch(()=>{
                                toast.error("Lỗi mạng")
                            })
                            .finally(()=>{
                                setOpenModalAddStudent(false)
                            })
                        }
                    }
                    >Lưu</Button>

                        
                    </div>
                    
                </div>
            </Modal>
            <Modal
                        open={openModalAssignToCouncil}
                        onClose={()=>setOpenModalAssignToCouncil(false)}
                        aria-labelledby="modal-modal-title-mentor-assign"
                        aria-describedby="modal-modal-description-mentor-assign"
                    >
                        <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                            Thêm giảng viên vào nhóm hội đồng
                        </h2>
                            <div className="mt-5">
                                {
                                    loadingData ? <LoadingData /> : 
                                    <DataGrid
                                        apiRef={apiRefTeacher}
                                        rows={rowsTeacher}
                                        loading={loadingData}
                                        columns={columnsTeacher}
                                        // rowCount={totalTeacher}
                                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                        initialState={{
                                            pagination: {
                                                paginationModel: {
                                                    page: 0, 
                                                    pageSize: 5 
                                                },
                                            },
                                        }}
                                        onCellClick={({row})=>{
                                            setSelectdTeacher(row);
                                        }}
                                        slots={{ toolbar: GridToolbar }}
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
                                        setOpenModalAssignToCouncil(false)
                                    }}
                                    >Đóng</Button>
                                </div>
                                <Button variant="contained" onClick={()=>{
                                    const req: AssignCouncilTeaching ={
                                        councilId: idCouncil,
                                        usernameTeaching: selectedTeacher?.userNameTeacher,
                                        semesterTeachingId: idSemester,
                                        positionInCouncil: selectedRole
                                    }
                                    assginCouncilToTeaching(req)
                                    .then((res:IResponse<any>)=>{
                                        if(res.success){
                                            toast.success(res.msg)
                                            handleFetchApiTeacherNotInCouncil();
                                            handleFetchDetailCouncil();
                                        }else{
                                            toast.error(res.msg)
                                        }
                                    })
                                    .catch(()=>{
                                        toast.error("Lỗi mạng")
                                    })
                                    .finally(()=>{
                                        setOpenModalAssignToCouncil(false)
                                    })
                                }
                            }
                            >Lưu</Button>

                                
                            </div>
                            
                        </div>
            </Modal>

            <Modal
                open={openModalAssignCommentator}
                onClose={()=>setOpenModalAssignCommentator(false)}
                aria-labelledby="modal-modal-title-mentor-assign"
                aria-describedby="modal-modal-description-mentor-assign"
            >
                <div className="p-5 rounded-xl bg-white w-3/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                    Gán giảng viên phản biện
                </h2>
                    <div className="mt-5">
                        {
                            loadingData ? <LoadingData /> : 
                            <DataGrid
                                apiRef={apiRefTeacher}
                                rows={lstTeachingInCouncil}
                                loading={loadingData}
                                columns={columnsTeacher}
                                // rowCount={totalTeacher}
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            page: 0, 
                                            pageSize: 5 
                                        },
                                    },
                                }}
                                onCellClick={({row})=>{
                                    setSelectdTeacher(row);
                                }}
                                slots={{ toolbar: GridToolbar }}
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
                                setOpenModalAssignCommentator(false)
                            }}
                            >Đóng</Button>
                        </div>
                        <Button variant="contained" onClick={()=>{
                            // const req: AssignCouncilTeaching ={
                            //     councilId: idCouncil,
                            //     usernameTeaching: selectedTeacher?.userNameTeacher,
                            //     semesterTeachingId: idSemester,
                            //     positionInCouncil: selectedRole
                            // }
                            assignCommentator(selectedStudent?.userName,selectedTeacher?.userNameTeacher)
                            .then((res:IResponse<any>)=>{
                                if(res.success){
                                    toast.success(res.msg)
                                    hanleFetchApi()
                                }else{
                                    toast.error(res.msg)
                                }
                            })
                            .catch(()=>{
                                toast.error("Lỗi mạng")
                            })
                            .finally(()=>{
                                setOpenModalAssignCommentator(false)
                            })
                        }
                    }
                    >Lưu</Button>

                        
                    </div>
                    
                </div>
            </Modal>
        </>
    );
}

export default DetailCouncil;