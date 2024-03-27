import { TextField } from "@mui/material";
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import * as React from 'react';

export default function CustomEditComponent(props: GridRenderEditCellParams) {
    const { id, value, field, hasFocus } = props;
    const apiRef = useGridApiContext();
    const ref = React.useRef();
  
    // React.useLayoutEffect(() => {
    //   if (hasFocus && ref) {
    //     ref.current.focus();
    //   }
    // }, [hasFocus]);
  
    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };
  
    return <>
            <TextField
                sx={{
                  "& fieldset": { border: 'none' },
                }}
                value={props.value || ""}
                onChange={handleValueChange}
                id="outlined-multiline-flexible"
                multiline
                maxRows={4}
                fullWidth
            />
          </>;
  }