import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  viVN,
  GridPaginationModel
} from '@mui/x-data-grid';
import { Resistor } from 'mdi-material-ui';



interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}



interface IProps{
    editMode?:"row" | "cell",
    columns:GridColDef[],
    valueRows: GridRowsProp,
    initalRows: any,
    hidePagination: boolean,
    pageSize: number,
    page:number,
    dataFind?: any,
    handleCallApi:(search:any)=>any
}



export default function TableCustom({dataFind,columns,editMode,initalRows,hidePagination,pageSize,page,handleCallApi}:IProps) {
  const [rows, setRows] = React.useState<any>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const mapPageToNextCursor = React.useRef<{ [page: number]: GridRowId }>({});

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: pageSize,
    page: page,
    total: 0
  });

  React.useEffect(()=>{
    if(hanleFetchApi){
      hanleFetchApi();
    }
  },[paginationModel.page])

  const hanleFetchApi = () => {
    handleCallApi({
      pageSize: paginationModel.pageSize,
      pageIndex:  paginationModel.page + 1,
      ...dataFind
    })
    .then((res:any)=>{
      console.log(res)
      if(res.success && res.returnObj && res.returnObj.listResult) {
        console.log(res.returnObj.listResult)
        const dataMap = res.returnObj.listResult;
        setPaginationModel({
          ...paginationModel,
          total: res.returnObj.totalPage
        })
        const newMap = dataMap.map((data:any,index:any)=>{
            return {
              id: rows.length * paginationModel.page + index + 1,
              ...data,
            }
        })
        console.log(newMap)
        setRows(newMap)
      }
    })
  }

  const styled = {
    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
      outline: "none !important",
   },

   '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
     py: 1,
   },
   '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
     py: '15px',
   },
   '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
     py: '22px',
   },
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    
    const handleClick = () => {
      const id = 1;
      setRows((oldRows) => [...oldRows, {
        ...initalRows,id: oldRows.length + 1
      }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };
     
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Thêm mới
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
    setRows(rows.filter((row:any) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row:any) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row:any) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row:any) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
    // We have the cursor, we can allow the page transition.
    setPaginationModel({
      ...paginationModel,
      page:newPaginationModel.page
    })
    // if (
    //   newPaginationModel.page === 0 ||
    //   mapPageToNextCursor.current[newPaginationModel.page - 1]
    // ) {
    //   setPaginationModel(newPaginationModel);
    // }
    // setPaginationModel({
    //   page: page++,
    //   pageSize: pageSize,
    // })
    // const data = handleCallApi(newPaginationModel);
    // if(data.indexPage){
    //   setPaginationModel({
    //     page: data.indexPage,
    //     pageSize: pageSize,
    //   })
    // }
  };
  

  


  const columnsTable: GridColDef[] = [
    ...columns,
  ];

  // thêm nút chức năng cho bảng để chỉnh sửa
  if(editMode){
    columnsTable.push({
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
    })
  }

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        sx={styled}
        rows={rows}
        columns={columnsTable}
        editMode={editMode}
        rowCount={paginationModel.total}
        // rowLength= {10}
        // maxColumns= {1}
        // autoPageSize
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowHeight={() => 'auto'}
        hideFooterPagination={hidePagination}
        pageSizeOptions={[5, 10, 25]}
        paginationMode="server"
        // onPaginationModelChange={handlePaginationModelChange}
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        slots={editMode ? {
          toolbar: EditToolbar,
        } : {}}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}