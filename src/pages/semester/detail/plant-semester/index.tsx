import { Button } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridPreProcessEditCellProps, GridRenderCellParams, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbar, GridToolbarContainer, viVN } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    randomId,
  } from '@mui/x-data-grid-generator';
import { addScheduleSemester, deleteScheduleSemester, getListScheduleSemester, updateScheduleSemester } from "~/services/scheduleSemesterApi";
import { IScheduleSemester } from "~/types/IScheduleSemester";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { useParams } from "react-router-dom";
import { IResponse } from "~/types/IResponse";
import { toast } from "react-toastify";
import CustomEditComponent from "~/components/TableEdit.tsx/TextLines";
import ExpandableCell from "~/components/TableEdit.tsx/ExpandableCell";
import { validateFromDateAndToDate } from "~/ultis/common";


const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return roles[0];
};

// const initialRows: GridRowsProp = [
//   {
//     id: randomId(),
//     name: "hello",
//     age: 25,
//     joinDate: new Date(),
//     role: randomRole(),
//   },
//   {
//     id: randomId(),
//     name: "hello",
//     age: 36,
//     joinDate: new Date(),
//     role: randomRole(),
//   },
//   {
//     id: randomId(),
//     name: "hello",
//     age: 19,
//     joinDate: new Date(),
//     role: randomRole(),
//   }
// ];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}




function PlantSemester() {
const [rows, setRows] = useState<GridRowsProp>([]);
const [flagEdit,setFlagEdit] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const info = useAppSelector(inforUser);
  console.log(info);
  let { id } = useParams();

  useEffect(()=>{
    if(typeof id === 'string'){
        getListScheduleSemester(id)
        .then((res: IResponse<IScheduleSemester[]>)=>{
            if(res.success){
                const scheduleList = res.returnObj;
                const initialRowsData:any = [];
                console.log(scheduleList);
                if(scheduleList.length > 0){
                    scheduleList.map((item)=>{
                        console.log(item.scheduleSemesterId)
                        const value: any = {
                            id: item.scheduleSemesterId,
                            fromDate: item?.fromDate ? new Date(item?.fromDate) : new Date(),
                            toDate: item?.toDate ? new Date(item?.toDate) : new Date(),
                            typeSchedule: "Market", 
                            createdByName: item?.createdByNavigation?.fullName,
                            implementer: item?.implementer,
                            content: item?.content,
                            note: item?.note,
                        }
                        initialRowsData.push(value);
                    })

                    setRows([...initialRowsData])

                }
            }
        })
    }
  },[])

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
      const idSemester = id;
      const currentDate = new Date();
      currentDate.setHours(12, 1, 0, 0);
      const req: IScheduleSemester = {
          fromDate: currentDate,
          toDate: currentDate,
          typeSchedule: "Market", 
          semesterId: idSemester,
          createdBy: info?.userName,
          implementer: "",
          content: "",
          note: "",
      }
      addScheduleSemester(req)
          .then((res:IResponse<string>) =>{
            if(res.success){
                const idSchedule = res.returnObj;
                setRows((oldRows) => [...oldRows, { id: idSchedule , ...req,createdByName: info?.fullName, isNew: true }]);
                setRowModesModel((oldModel) => ({
                    ...oldModel,
                    [idSchedule]: { mode: GridRowModes.Edit, fieldToFocus: 'content' },
                }));   
            }else{
                toast.error(res.msg)
            } 
          })
          .catch(err=>{
                toast.error("Lỗi mạng !")
          })
  
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Thêm kế hoạch
        </Button>
        {/* <GridToolbar /> */}
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
    deleteScheduleSemester(id)
        .then((res:IResponse<any>)=>{
            if(res.success){
                setRows(rows.filter((row) => row.id !== id));
                toast.success(res.msg);
            }else{
                toast.error(res.msg);
            }
        })
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
    const updatedRow:any = { ...newRow, isNew: false };
    console.log(updatedRow)
    const semesterId = id;
    let check = false;
    const fromDate = updatedRow.fromDate;
    const toDate = updatedRow.toDate;
    const result = validateFromDateAndToDate(fromDate,toDate);
    if(!result) {
        toast.warn("Thời gian không hợp lệ !")
        return;
    }
    const req: IScheduleSemester = {
        scheduleSemesterId: updatedRow.id,
        fromDate: updatedRow?.fromDate,
        toDate: updatedRow?.toDate,
        typeSchedule: updatedRow?.typeSchedule,
        semesterId: semesterId,
        createdBy:info?.userName,
        implementer: updatedRow?.implementer,
        content: updatedRow?.content,
        note: updatedRow?.note,
    }
    updateScheduleSemester(req)
        .then((res:IResponse<any>)=>{
            if(res.success){
                toast.success(res.msg)
            }else{
                toast.error(res.msg)
            }
        })
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

    const columns: GridColDef[] = [
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
        //   preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        //     let check = false;
        //     const toDate = params.props.value;
        //     const fromDate = params.props.value;
        //     const result = compareTime(fromDate,toDate);
        //     if(result === 1){
        //         check = true;
        //         toast.warn("Thời gian bắt đầu phải bé hơn thời gian kết thúc !")
        //     }
        //     return { ...params.props, error: check };
        //   },
        },
        {
            field: 'toDate',
            headerName: 'Đến ngày',
            type: 'dateTime',
            width: 250,
            editable: true,
            // preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
            //     let check = false;
            //     const fromDate = params.row?.fromDate;
            //     const toDate = params.props.value;
            //     console.log(fromDate)
            //     console.log(toDate)
            //     const result = compareTime(fromDate,toDate);
            //     if(result === -1){
            //         check = true;
            //         toast.warn("Thời gian kết thúc phải lớn hơn thời gian bắt đầu !")
            //     }
            //     return { ...params.props, error: check };
            // },
        },
        { field: 'implementer', headerName: 'Người thực hiện', width: 180, editable: true },
        {
          field: 'typeSchedule',
          headerName: 'Loại lịch',
          width: 220,
          editable: true,
          type: 'singleSelect',
          valueOptions: ['Market', 'Finance', 'Development'],
        },
        { field: 'note', headerName: 'Ghi chú', width: 180, editable: true },
        { field: 'createdByName', headerName: 'Người tạo', width: 180, editable: false },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
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

    return ( <div className="px-8 overflow-scroll max-h-full">
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


    
    </div> );
}

export default PlantSemester;

