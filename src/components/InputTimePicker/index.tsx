import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMemo, useState } from 'react';
import dayjs,{ Dayjs } from 'dayjs';
import { DateValidationError,DateTimeValidationError } from '@mui/x-date-pickers/models';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { viVN } from '@mui/x-date-pickers/locales';
type IProps={
    initialValue?:Date,
    label:string,
    name:string,
    defaultValue?:Dayjs,
    minDate?:Dayjs,
    maxDate?:Dayjs,
    disableFuture?:boolean,
    disablePast?:boolean,
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
    const {type,initialValue,onChange,name,label,defaultValue,minDate,maxDate,disablePast,disableFuture} = props

    const [error, setError] = useState<DateValidationError | DateTimeValidationError | null>(null);



    const errorMessage = useMemo(() => {
        switch (error) {
          case 'maxDate':
          case 'minDate':
          case 'invalidDate': {
            return `${label} không hợp lệ`;
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
                    localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
                    format='DD/MM/YYYY HH:mm:ss'
                    value={value}
                    name={name}
                    defaultValue={defaultValue}
                    minDate={minDate}
                    maxDate={maxDate}
                    disableFuture={disableFuture}
                    disablePast={disablePast}
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
                localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
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
                defaultValue={defaultValue}
                minDate={minDate}
                maxDate={maxDate}
                disableFuture={disableFuture}
                disablePast={disablePast}

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