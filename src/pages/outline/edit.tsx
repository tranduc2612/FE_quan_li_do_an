import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import { Button, InputLabel, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, Pencil,PrinterCheck } from "mdi-material-ui";
import * as yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import InputCustom from "~/components/InputCustom";
import Add from "@mui/icons-material/Add";
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRenderCellParams, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, viVN } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CustomEditComponent from "~/components/TableEdit.tsx/TextLines";
import ExpandableCell from "~/components/TableEdit.tsx/ExpandableCell";
import { EditToolbarProps } from "../semester/detail/plant-semester";
import { randomId } from "@mui/x-data-grid-generator";
import { toast } from "react-toastify";
import { validateFromDateAndToDate } from "~/ultis/common";
import { addProjectOutline, getProjectOutline, updateProjectOutline } from "~/services/projectOutlineApi";
import { IProjectOutline } from "~/types/IProjectOutline";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { IResponse } from "~/types/IResponse";



const validationSchema = yup.object({
    nameProject: yup
      .string()
      .required('Tên đồ án không được để trống'),
    contentProject: yup
      .string()
      .required('Nội dung công việc không được để trống'),
    techProject: yup
       .string()
      .required('Công nghệ sự dụng không được để trống'),
    expectResult: yup
      .string()
     .required('Kết quả mông đợi không được để trống')
  });

function EditOutlinePage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [data,setData] = useState<IProjectOutline>();
    const info = useAppSelector(inforUser)
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [flagEdit,setFlagEdit] = useState(false);
    const [total, setTotal] = useState(0);

    const formik = useFormik({
        initialValues: {
            nameProject: "",
            contentProject:"",
            expectResult: "",
            techProject:"",
            plantOutline:""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if(rows.length === 0){
                toast.warning("Bạn chưa đăng ký kế hoạch thực hiện đề tài")
            }
            const plantOutlineConvert = JSON.stringify(rows);
            const req: IProjectOutline = {
                userName: info?.userName,
                nameProject: formik.values.nameProject,
                contentProject: JSON.stringify(formik.values.contentProject),
                expectResult: JSON.stringify(formik.values.expectResult),
                techProject: JSON.stringify(formik.values.techProject),
                plantOutline: plantOutlineConvert
            }
            updateProjectOutline(req)
            .then((res)=>{
                if(res.success){
                    toast.success(res.msg)
                    navigate("/outline/"+info?.userName)
                }else{
                    toast.error(res.msg)
                }
            })
            .catch(err =>{
                toast.error("Lỗi mạng")
            })
        },
    });

    useEffect(()=>{
        getProjectOutline(info?.userName || "")
        .then((res:IResponse<IProjectOutline>)=>{
            if(res.returnObj === null || info?.userName !== id){
                navigate("/outline/"+id)
            }else{
              let resData = res.returnObj;
                if(res.returnObj.contentProject){
                    resData = {
                        ...resData,
                        contentProject: JSON.parse(res.returnObj.contentProject)
                    }
                }
                if(res.returnObj.expectResult){
                    resData = {
                        ...resData,
                        expectResult: JSON.parse(res.returnObj.expectResult)
                    }
                }
                if(res.returnObj.techProject){
                    resData = {
                        ...resData,
                        techProject: JSON.parse(res.returnObj.techProject)
                    }
                }
                formik.setValues({
                  nameProject: resData?.nameProject || "",
                  contentProject:resData?.contentProject || "",
                  expectResult: resData?.expectResult || "",
                  techProject:resData?.techProject || "",
                  plantOutline:resData?.plantOutline || ""
                })
                
                if(res.returnObj.plantOutline){
                    const plant = JSON.parse(res.returnObj.plantOutline);
                    const mapPlant = plant.map((item:any)=>{
                        return {
                            ...item,
                            fromDate: new Date(item?.fromDate),
                            toDate: new Date(item?.toDate),
                        }
                    })
                    setRows(mapPlant)
                    setTotal(plant.length)
                }
                setData(res.returnObj);
                // if(data?.plantOutline){
                //     const plants = JSON.parse(data?.plantOutline);
                //     if(plants.length > 0){
                //         // setRows([...plants])
                //         setTotal(plants.length)
                //     }
                // }
            }
        })
    },[])

    

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
        }
      };
    
    function EditToolbar(props: EditToolbarProps) {
        const { setRows, setRowModesModel } = props;
      
        const handleClick = () => {
          const id = randomId();
          const currentDate = new Date();
          currentDate.setHours(12, 1, 0, 0);
          setRows((oldRows) => [...oldRows, { id,
            stt: rows.length + 1,
            content: "", 
            fromDate: currentDate,
            toDate: currentDate,
            note: "",
            isNew: true }]);
          setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
          }));
        };
      
        return (
          <GridToolbarContainer>
            <Button color="primary" startIcon={<Add />} onClick={handleClick}>
              Thêm mới kế hoạch
            </Button>
          </GridToolbarContainer>
        );
    }
     
    
      const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      };
    
      const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      };
    
      const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
      };
    
      const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
          setRows(rows.filter((row) => row.id !== id));
        }
      };
    
      const processRowUpdate = (newRow: GridRowModel) => {
        if (flagEdit) {
            setFlagEdit(false);
            return;
        }
        console.log(newRow)
        const updatedRow:any = { ...newRow, isNew: false };
        console.log(updatedRow)
        const fromDate = updatedRow.fromDate;
        const toDate = updatedRow.toDate;
        const result = validateFromDateAndToDate(fromDate,toDate);
        if(!result) {
            toast.warn("Thời gian không hợp lệ !")
            return;
        }
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      };
    
      const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
      };

    const columns: GridColDef[] = [
        {
            field: 'stt',
            headerName: 'STT',
            type: 'text',
            width: 50,
            editable: true,
        },
        {
          field: 'content',
          headerName: 'Nội dung công việc',
          width: 400,
          align: 'left',
          headerAlign: 'left',
          editable: true,
          renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
          renderEditCell: (props) => <><CustomEditComponent {...props} />
        </>
        },
        {
          field: 'fromDate',
          headerName: 'Từ ngày',
          type: 'dateTime',
          width: 250,
          editable: true,
        },
        {
            field: 'toDate',
            headerName: 'Đến ngày',
            type: 'dateTime',
            width: 250,
            editable: true,
        },
        {
            field: 'note',
            headerName: 'Ghi chú',
            width: 250,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
            renderEditCell: (props) => <><CustomEditComponent {...props} />
          </>
          },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Thao tác',
          width: 100,
          cellClassName: 'actions',
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }
    
            return [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        },
    ];

    return ( <>
        <HeaderPageTitle pageName="Đề cương đồ án" />
        <BoxWrapper className={""}>
            <form onSubmit={formik.handleSubmit}>
                <div className="flex justify-between w-full mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                    <div>
                        <Button variant="contained" type="submit" startIcon={<Check />}>
                            Lưu
                        </Button>
                        {/* <Button onClick={()=>{navigate(-1)}} variant="contained" startIcon={<PrinterCheck />}>
                            In
                        </Button> */}
                    </div>
                </div>

                <div>
                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                        Nội dung đề cương
                    </h2>

                    <div className={"grid grid-cols-4"}>
                        <div className={"col-span-4 m-3"}>
                            <InputCustom
                                id={"nameProject"}
                                label="Tên đề tài"
                                name={"nameProject"}
                                value={formik.values.nameProject} 
                                isError={formik.touched.nameProject && Boolean(formik.errors.nameProject)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.nameProject && formik.errors.nameProject} 
                            />
                        </div>

                        <div className={"col-span-4 m-3"}>
                            <InputCustom
                                id={"contentProject"}
                                label="Nội dung công việc"
                                placeholder={"Đề cập đến phạm vi của bài toán"}
                                name={"contentProject"}
                                multiline={true}
                                value={formik.values.contentProject} 
                                isError={formik.touched.contentProject && Boolean(formik.errors.contentProject)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.contentProject && formik.errors.contentProject} 
                            />
                        </div>

                        <div className={"col-span-4 m-3"}>
                            <InputCustom
                                id={"techProject"}
                                label="Công nghệ"
                                placeholder={"Công nghệ, công cụ và ngôn ngữ lập trình"}
                                name={"techProject"}
                                multiline={true}
                                value={formik.values.techProject} 
                                isError={formik.touched.techProject && Boolean(formik.errors.techProject)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.techProject && formik.errors.techProject} 
                            />
                        </div>

                        <div className={"col-span-4 m-3"}>
                            <InputCustom
                                id={"expectResult"}
                                label="Kết quả chính dự kiến đạt được"
                                placeholder={"Dự kiến kế quả của em sau khi hoàn thành đồ án VD: Đồ án A cho B dùng được"}
                                name={"expectResult"}
                                multiline={true}
                                value={formik.values.expectResult} 
                                isError={formik.touched.expectResult && Boolean(formik.errors.expectResult)} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.expectResult && formik.errors.expectResult} 
                            />
                        </div>

                        <div className={"col-span-4 m-2"}>
                            <b className={"text-primary-blue"}>Kế hoạch thực hiện đề tài</b>
                        </div>

                        

                        {/* <div className={"col-span-4 m-2 px-20"}>
                            <table className="w-full table-fixed">
                                <thead>
                                    <tr>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">STT</th>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">Nội dung công việc</th>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">Thời gian dự kiến</th>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
        
                                    <tr>
                                        <td className="border border-primary-blue text-center">1</td>
                                        <td className="border border-primary-blue p-2 break-words">Lorem ipsum ipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsum dolor sit amet,dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet,</td>
                                        <td className="border border-primary-blue text-center">26/12/2023 - 30/12/2023</td>
                                        <td className="border border-primary-blue p-2 break-words"></td>
                                        </tr>
                                    <tr>
                                        <td className="border border-primary-blue text-center">3</td>
                                        <td className="border border-primary-blue p-2 break-words">Lorem ipsum dolor sit amet,dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet,</td>
                                        <td className="border border-primary-blue text-center">26/12/2023 - 30/12/2023</td>
                                        <td className="border border-primary-blue p-2 break-words">lnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksalda</td>
                                    </tr>
                                </tbody>
                            </table>

                            
                        </div> */}
                    </div>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        hideFooterPagination={true}
                        getRowHeight={() => 'auto'}
                        onCellKeyDown={(params, event)=>{
                            if (event.key === 'Enter') {
                                setFlagEdit(true);
                            }
                        }}
                        onCellEditStart={(params, event) => {
                            setFlagEdit(false);
                        }}
                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        slots={{
                            toolbar: EditToolbar,
                        }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                    />
                </div>
            </form>
        </BoxWrapper>

    </> );
}

export default EditOutlinePage;