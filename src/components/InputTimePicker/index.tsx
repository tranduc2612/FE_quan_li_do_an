import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMemo, useState } from 'react';
import dayjs,{ Dayjs } from 'dayjs';
import { DateValidationError,DateTimeValidationError } from '@mui/x-date-pickers/models';
import { styled } from '@mui/material/styles';
type IProps={
    initialValue?:string,
    label:string,
    name:string,
    type: "DateTimePicker" | "DatePicker",
    onChange: (newValue: any)=>void
}

const CssDatePicker = styled(DatePicker)({
    '&': {
        width: '100%',
    },
    '& .MuiFormHelperText-root':{
        fontSize:"0.89rem",
        margin: '0px'
    }
});

function TimePickerCustom(props:IProps) {
    const {type,initialValue,onChange,name,label} = props

    const [error, setError] = useState<DateValidationError | DateTimeValidationError | null>(null);

    const errorMessage = useMemo(() => {
        switch (error) {
          case 'maxDate':
          case 'minDate': {
            return 'Please select a date in the first quarter of 2022';
          }
    
          case 'invalidDate': {
            return 'Ngày tháng năm sinh không hợp lệ';
          }
    
          default: {
            return '';
          }
        }
      }, [error]);


    const [value,setValue] = useState<Dayjs | null>(()=>{
        if(initialValue){
            return dayjs(initialValue)
        }

        return dayjs(new Date().toUTCString())
    })

    if(type === "DateTimePicker"){
        return ( <>
            <DateTimePicker
                className="w-full"
                label={label}
                format='DD/MM/YYYY HH:mm:ss'
                value={value}
                name={name}
                onError={(error) => {
                    setError(error)
                }}
                slotProps={{
                    textField: {
                      helperText: errorMessage,
                    },
                  }}
                onChange={(newValue) => {
                    setValue(newValue);
                    onChange(newValue);
                }}
            />
        </> );
    }

    if(type === "DatePicker"){
        return (
            <CssDatePicker
                className="w-full"
                label={label}
                format='DD/MM/YYYY'
                value={value}
                name={name}
                onError={(error) => {
                    setError(error)
                }}
                slotProps={{
                    textField: {
                      helperText: errorMessage,
                    },
                  }}
                disableFuture
                onChange={(newValue:any) => {
                    setValue(newValue);
                    onChange(newValue); 
                }}
            />
        )
    }

    return <>Sai Kieu</>

}

export default TimePickerCustom;