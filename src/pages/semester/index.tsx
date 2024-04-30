import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { Button, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel, useGridApiRef, viVN } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import TimePickerCustom from "~/components/InputTimePicker";
import RenderStatusTime from "~/components/RenderStatusTime";
import { getListPageSemester } from "~/services/semesterApi";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { convertDayjsToDate, formatDateTypeDateOnly, isCurrentTimeInRange } from "~/ultis/common";




function SemesterPage() {
    const [rows,setRows] = useState<any>([]);
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
        pageMax: -1
    });
    const apiRef = useGridApiRef();
    const [total, setTotal] = useState(0);
    const initialData = {
        semesterId: "",
        nameSemester: ""
    }
    const [fromDate,setFromDate] = useState<any>();
    const [toDate,setToDate] = useState<any>();


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
            field: 'semesterId',
            headerName: 'Mã học kỳ',
            width: 120,
            editable: true,
        },
        {
            field: 'nameSemester',
            headerName: 'Tên học kỳ',
            width: 250,
            editable: true,
        },
        {
            field: 'fromDate',
            headerName: 'Từ ngày',
            width: 150,
            editable: true,
            renderCell:({row})=>{
                return <>{formatDateTypeDateOnly(row?.fromDate)}</>
            }
        },
        {
            field: 'toDate',
            headerName: 'Đến ngày',
            width: 150,
            editable: true,
            renderCell:({row})=>{
                return <>{formatDateTypeDateOnly(row?.toDate)}</>
            }
        },
        {
            field: 'totalProjectAmount',
            headerName: 'Tổng số sinh viên',
            width: 160,
            editable: true,
        },
        {
            field: 'acceptProjectAmount',
            headerName: 'Được bảo vệ',
            width: 160,
            editable: true,
        },
        {
            field: 'rejectProjectAmount',
            headerName: 'Không được bảo vệ',
            width: 160,
            editable: true,
        },
        {
            field: 'pauseProjectAmount',
            headerName: 'Bảo lưu',
            width: 160,
            editable: true,
        },
        {
            field: 'avgScoreProject',
            headerName: 'Điểm trung bình',
            width: 160,
            editable: true,
        },
        {
            field: 'currentStatus',
            headerName: 'Trạng thái',
            width: 160,
            editable: true,
            renderCell:({row})=>{
                return <>{RenderStatusTime(isCurrentTimeInRange(new Date(row?.fromDate),new Date(row?.toDate)))}</>
            }
        },
        {
            field: 'createdBy',
            headerName: 'Người tạo',
            width: 160,
            editable: true,
        },
    ];

    

    useEffect(()=>{
        hanleFetchApi();
    },[paginationModel])

    const hanleFetchApi = async () => {
        if(paginationModel.page <= paginationModel.pageMax){
            return;
        }
        await getListPageSemester({
            pageSize: paginationModel.pageSize,
            pageIndex:  paginationModel.page + 1,
            semesterId: formik.values.semesterId,
            nameSemester: formik.values.nameSemester,
            fromDate: convertDayjsToDate(fromDate),
            toDate: convertDayjsToDate(toDate),
        })
        .then((res:IResponse<any>)=>{
          console.log(res)
          if(res.success && res.returnObj && res.returnObj.listResult) {
            console.log(res.returnObj.listResult)
            const dataMap = res.returnObj.listResult;
            const newMap = dataMap.map((data:ISemester,index:any)=>{
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
                if(apiRef){
                    apiRef.current.setPage(0)
                }
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

    const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
        // We have the cursor, we can allow the page transition.
        setPaginationModel({
            ...paginationModel,
            page:newPaginationModel.page
        })
    };

    return (
        <>
            <HeaderPageTitle pageName="Quản lý học kỳ" />
            <BoxWrapper className="max-h-full">
                <div className="p-4 overflow-scroll max-h-screen">
                        <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                             Danh sách học kỳ
                        </h2>
                        <div>
                                <form action="" onSubmit={formik.handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">

                                        <div className="col-span-6">
                                            <TextField
                                                onChange={formik.handleChange}
                                                value={formik.values.semesterId} 
                                                id="semesterId" 
                                                label="Mã học kỳ"
                                                name="semesterId"
                                                variant="outlined"
                                                fullWidth 
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <TextField
                                                onChange={formik.handleChange} 
                                                value={formik.values.nameSemester} 
                                                id="nameSemester" 
                                                label="Tên hoc kỳ"
                                                name="nameSemester"
                                                variant="outlined"
                                                fullWidth 
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <TimePickerCustom label="Từ ngày"
                                                value={fromDate} 
                                                name={"fromDate"} 
                                                type={"DatePicker"}
                                                maxDate={toDate}
                                                onChange={(e)=>{
                                                    setFromDate(e);
                                                }} 
                                                />
                                        </div>

                                        <div className="col-span-6">
                                            <TimePickerCustom label="Đến ngày" 
                                                value={toDate}
                                                name={"toDate"} 
                                                type={"DatePicker"}
                                                minDate={fromDate}
                                                onChange={(e)=>{
                                                    setToDate(e);
                                                }} 
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
                                                    setFromDate(null)
                                                    setToDate(null)
                                                }}>
                                                    <RefreshIcon />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Button variant="contained" startIcon={<AddIcon />} onClick={()=>{
                                                navigate("/semester/input")
                                            }}>
                                                Thêm mới
                                            </Button>
                                        </div>
                                    </div>
                                </form>

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
                                    loading={rows.length === 0}
                                    rows={rows}
                                    columns={columns}
                                    rowCount={total}
                                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                    onPaginationModelChange={handlePaginationModelChange}
                                    onCellClick={({row})=>{
                                        navigate("/semester/detail/"+row.semesterId)
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
                        
                </div> 
            </BoxWrapper> 
        </>
    );
}

export default SemesterPage;