import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { viVN } from '@mui/x-date-pickers/locales';
import { DateTimeValidationError, DateValidationError } from '@mui/x-date-pickers/models';
import { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
type IProps={
    label:string,
    name:string,
    defaultValue?:Dayjs,
    minDate?:Dayjs,
    maxDate?:Dayjs,
    disableFuture?:boolean,
    disablePast?:boolean,
    value: Dayjs | null,
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
    const {type,onChange,name,label,defaultValue,minDate,maxDate,disablePast,disableFuture,value} = props

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
                    console.log(newValue)
                    onChange(newValue);
                }}
            />
        )
    }

    return <>Sai Kieu</>

}

export default TimePickerCustom;