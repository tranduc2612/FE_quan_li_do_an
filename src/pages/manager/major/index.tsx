import Add from '@mui/icons-material/Add';
import { Button, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { AccountEdit, ChevronLeft } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BoxWrapper from "~/components/BoxWrap";
import { getListMajor } from "~/services/majorApi";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";
import { formatDate } from "~/ultis/common";
import { IPageProps } from "../index";
import InputMajor from './input';




function MajorManage({setCurrentPage}:IPageProps) {
    const [rows,setRows] = useState<any>([]);
    const navigate = useNavigate();
    const [majorSelect,setMajorSelect] = useState<IMajorType>({
        majorId: "",
        majorName:"",
        createdAt: "",
        createdBy: ""
    });
    const [switchPageInput,setSwitchPageInput] = useState(false);
    const [paginationModel, a] = useState({
        pageSize: 5,
        page: 0,
        pageMax: -1
    });
    const apiRef = useGridApiRef();


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
                    <div className="cursor-pointer p-1 hover:bg-slate-300 rounded-full text-blue-500 mx-1" onClick={(e)=>{
                            e.stopPropagation();
                            setSwitchPageInput(true);
                            setMajorSelect(row);
                    }}>
                        <Tooltip title="Chỉnh sửa thông tin">
                            <AccountEdit />
                        </Tooltip>
                    </div>
    
    
                </>
            }
        },
        {
            field: 'majorId',
            headerName: 'Mã chuyên ngành',
            width: 200,
            editable: true,
        },
        {
            field: 'majorName',
            headerName: 'Tên chuyên ngành',
            width: 200,
            editable: true,
        },
        {
            field: 'createdBy',
            headerName: 'Người tạo',
            width: 200,
            editable: true,
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 200,
            editable: true,
            renderCell:({row})=>{
                return <>{formatDate(row?.createdAt)}</>;
            }
        },
        
    ];

    useEffect(()=>{
        hanleFetchApi();
    },[])

    const hanleFetchApi = async () => {
        await getListMajor({
            majorId:"",
            majorName:""
        })
        .then((res:IResponse<any>)=>{
          console.log(res)
          if(res.success && res.returnObj) {
            const dataMap = res.returnObj;
            const newMap = dataMap.map((data:IMajorType,index:any)=>{
                console.log(data)
                return {
                  id: index + 1,
                  ...data
                }
            })
            console.log(newMap)
            const totalItem = res.returnObj.totalItem;
            if(totalItem === 0){
                setRows([])
            }else {
                setRows([...newMap])
            }

          }
        })
      }

    return (
        <BoxWrapper className="max-h-full">
            <div className="p-4 overflow-scroll max-h-screen">
                {
                    switchPageInput && 
                    <div className="mb-4">
                        <Button onClick={()=>{
                            setMajorSelect({
                                majorId: "",
                                majorName:"",
                                createdAt: "",
                                createdBy: ""
                            })   
                            setSwitchPageInput(false)
                            }} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                        </Button>
                    </div>
                } 
                    <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                        {switchPageInput ? majorSelect?.majorId.length != 0 ? "Cập nhật chuyên ngành" : "Thêm chuyên ngành" : "Danh sách chuyên ngành "}
                    </h2>
                    {
                        switchPageInput ?
                        <><InputMajor 
                        switchPageInput={switchPageInput} 
                        setSwitchPageInput={setSwitchPageInput} 
                        majorSelect={majorSelect} 
                        handleFetchApi={hanleFetchApi}
                        /> </>
                            : <div>
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
                                initialState={{
                                pagination: {
                                    paginationModel: { page: paginationModel.page, pageSize: paginationModel.pageSize },
                                },
                                }}
                                slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                    <GridToolbarColumnsButton />
                                    <GridToolbarFilterButton  />
                                    <Button variant='text' startIcon={<Add />} onClick={()=>{
                                        setSwitchPageInput(true)
                                        setMajorSelect({
                                            majorId: "",
                                            majorName:"",
                                            createdAt: "",
                                            createdBy: ""
                                        })  
                                    }}>
                                        Thêm mới chuyên ngành
                                    </Button>
                        </GridToolbarContainer></> }}
                                pageSizeOptions={[5, 10]}
                            />
                        </div>
                    </div>
                    }
                    
            </div> 
        </BoxWrapper> 
    );
}

export default MajorManage;