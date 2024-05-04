import { Button, MenuItem, Select } from "@mui/material";
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

import { useGridApiContext } from "@mui/x-data-grid";

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

const SCHEDULE_TYPE = [
  { label: 'Lịch thông báo', value: 'SCHEDULE_NORMAL' },
  { label: 'Lịch chốt đề cương', value: 'SCHEDULE_FOR_OUTLINE' },
  { label: 'Lịch nhận xét điểm GVHD', value: 'SCHEDULE_FOR_MENTOR' },
  { label: 'Lịch nhận xét điểm GVPB', value: 'SCHEDULE_FOR_COMMENTATOR' },
  { label: 'Lịch nộp báo cáo tổng kết', value: 'SCHEDULE_FINAL_FILE' },
  { label: 'Lịch chấm điểm tổng kết', value: 'SCHEDULE_FINAL_SCORE' }
]

export interface EditToolbarProps {
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
  const [scheduleOption,setScheduleOption] = useState(SCHEDULE_TYPE)
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
                    let scheduleTypeLeft = [...SCHEDULE_TYPE];
                    scheduleList.map((item)=>{
                        console.log(item.typeSchedule)
                        
                        const value: any = {
                            id: item.scheduleSemesterId,
                            fromDate: item?.fromDate ? new Date(item?.fromDate) : new Date(),
                            toDate: item?.toDate ? new Date(item?.toDate) : new Date(),
                            typeSchedule: item?.typeSchedule, 
                            createdByName: item?.createdByNavigation?.fullName,
                            implementer: item?.implementer,
                            content: item?.content,
                            note: item?.note
                        }
                        scheduleTypeLeft = scheduleTypeLeft.filter(type=>type.value !== item.typeSchedule)
                        initialRowsData.push(value);
                    })
                    setScheduleOption(scheduleTypeLeft)
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
      const prevDate = new Date();
      prevDate.setDate(currentDate.getDate() - 7)
      const req: IScheduleSemester = {
          fromDate: prevDate,
          toDate: currentDate,
          typeSchedule: "SCHEDULE_NORMAL", 
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
                const dataFind = rows.find((row) => row.id === id);
                // setScheduleOption(SCHEDULE_TYPE.find(item=>item.value != updatedRow?.typeSchedule))
                const TypeSchedule = SCHEDULE_TYPE.find(item=>item.value == dataFind?.typeSchedule)
                if(TypeSchedule){
                  setScheduleOption([
                    ...scheduleOption,
                    TypeSchedule
                  ])
                }
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
    const fromDate = updatedRow.fromDate;
    const toDate = updatedRow.toDate;
    console.log(info?.userName)

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
                setScheduleOption(scheduleOption.filter(item=>item.value != updatedRow?.typeSchedule))
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
        {
          field: 'content',
          headerName: 'Nội dung công việc',
          width: 300,
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
          width: 150,
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
            width: 150,
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
          
          valueOptions: ({ row })=>{
            if(scheduleOption.length === SCHEDULE_TYPE.length){
              return SCHEDULE_TYPE
            }
            const findSchedule = SCHEDULE_TYPE.find(x=>x.value === row?.typeSchedule);
            if(findSchedule){
              return [findSchedule,...scheduleOption]
            }
            return [...scheduleOption]
          } ,
          // renderEditCell: ({row,id,field}) => {
          //   return <Select
          //   labelId="demo-simple-select-label"
          //   id="demo-simple-select"
          //   value={row?.typeSchedule}
          //   label="Age"
          //   fullWidth
          //   onChange={(event)=>
          //     {
          //     const newValue = event.target.value;
          //     apiRef.current.setEditCellValue({ id, field, value: newValue });
          //   }}
          // >
          //   {
          //     scheduleOption?.map((item)=><MenuItem value={item.value}>{item.label}</MenuItem>)
          //   }
          //   {/* <MenuItem value={10}>Ten</MenuItem>
          //   <MenuItem value={20}>Twenty</MenuItem>
          //   <MenuItem value={30}>Thirty</MenuItem> */}
          // </Select>
          // }
        },
        { field: 'note', headerName: 'Ghi chú', width: 180, editable: true },
        { field: 'createdByName', headerName: 'Người tạo', width: 180, editable: false },
        
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

