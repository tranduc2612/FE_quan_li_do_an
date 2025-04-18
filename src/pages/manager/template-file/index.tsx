import Add from '@mui/icons-material/Add';
import { Button, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiRef, viVN } from "@mui/x-data-grid";
import { AccountEdit, ChevronLeft, Download, Upload } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BoxWrapper from "~/components/BoxWrap";
import { getListMajor } from "~/services/majorApi";
import { IMajorType } from "~/types/IMajorType";
import { IResponse } from "~/types/IResponse";
import { formatDate } from "~/ultis/common";
import { IPageProps } from "../index";
import { IClassificationType } from '~/types/IClassificationType';
import { dowloadFileTemplate, getListClassification, updateFileTemplate } from '~/services/classificationApi';
import { toast } from 'react-toastify';




function TemplateFileManage({setCurrentPage}:IPageProps) {
    const [rows,setRows] = useState<any>([]);
    const navigate = useNavigate();
    const [classificationSelect,setClassificationSelect] = useState<IClassificationType>({
        classifiId: "",
        typeCode: "",
        code: "",
        value: "",
        role: "",
        fileName: "",
        url: "",
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
                            if(row?.code){
                                dowloadFileTemplate(row?.code)
                                .then((res:any)=>{
                                    const link = document.createElement('a');
                                    const fileName = `BanMau_${row?.code}.docx`;
                                    link.setAttribute('download', fileName);
                                    link.href = URL.createObjectURL(new Blob([res]));
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                })
                                .catch((err)=>{
                                    console.log(err)
                                    toast.warning("Không hợp lệ")
                                })
                            }
                    }}>
                        <Tooltip title="Tải mẫu">
                            <Download />
                        </Tooltip>
                    </div>

                    <div className="cursor-pointer p-1 hover:bg-slate-300 rounded-full text-yellow-500 mx-1" onClick={(e)=>{
                            e.stopPropagation();
                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = '.docx';
                            fileInput.style.display = 'none';
                            fileInput.onchange = (e:any) => {
                                const file = e.target.files[0];
                                if (!file) {
                                    toast.warn("Vui lòng chọn một file");
                                    return;
                                }
                                const allowedExtensions = /(\.docx)$/i;
                                if (!allowedExtensions.exec(file.name)) {
                                    toast.warn("Định dạng tệp tin không hợp lệ. Vui lòng chọn file định dạng .docx");
                                    return;
                                }

                                const formData = new FormData();
                                formData.append('code',row?.code || "")
                                formData.append('typeCode',row?.typeCode || "")
                                formData.append('file', file);

                                updateFileTemplate(formData)
                                .then((res:any)=>{
                                    console.log(res)
                                    if(res?.status == 200){
                                        toast.success("Cập nhật file thành công !");
                                    }else{
                                        toast.warn("Có lỗi xảy ra!");
                                    }
                                })

                            };
                            document.body.appendChild(fileInput);
                            fileInput.click();
                            document.body.removeChild(fileInput);
                    }}>
                        <Tooltip title="Sủa mẫu">
                            <Upload />
                        </Tooltip>
                    </div>
    
                </>
            }
        },
        {
            field: 'code',
            headerName: 'Mã biểu mẫu',
            width: 200,
            editable: true,
        },
        {
            field: 'value',
            headerName: 'Tên biểu mẫu',
            width: 350,
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
        const req: IClassificationType = {
            typeCode: "TEMPLATE_FILE"
        }
        await getListClassification(req)
        .then((res:IResponse<any>)=>{
          console.log(res)
          if(res.success && res.returnObj) {
            const dataMap = res.returnObj;
            const newMap = dataMap.map((data:IClassificationType,index:any)=>{
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
                    <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                        Danh sách biểu mẫu
                    </h2>
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
                                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                initialState={{
                                pagination: {
                                    paginationModel: { page: paginationModel.page, pageSize: paginationModel.pageSize },
                                },
                                }}
                                slots={{ toolbar: ()=> <> <GridToolbarContainer>
                                    <GridToolbarColumnsButton />
                                    <GridToolbarFilterButton  />
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

export default TemplateFileManage;