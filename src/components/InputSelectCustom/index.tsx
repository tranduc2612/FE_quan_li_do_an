import { IconButton, InputAdornment } from '@mui/material';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
type IProps = {
    id:string,
    label: string,
    value?: any,
    placeholder: string
    name: string,
    onChange: any,
    onBlur: any,
    children:any,
    defaultValue?:any,
    isError?: boolean,
    readOnly?:boolean
}

const CssTextField = styled(Select)({
    '&:focus': {
        width: '100%',
    },
});

function InputSelectCustom({
    label,
    id,
    name,
    value,
    children,
    onChange,
    onBlur,
    placeholder,
    defaultValue,
    isError,
    readOnly
}: IProps) {
    
    console.log(placeholder)
    return (<>
    <FormControl 
            fullWidth>
        <InputLabel id={id}>{label}</InputLabel>
        <CssTextField
            labelId={id}
            id={id}
            value={value}
            name={name}
            label={label}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={onBlur}
            defaultValue={defaultValue}
            error={isError}
            readOnly={readOnly}
        >
            {children}
        </CssTextField>
    </FormControl>
    </>);
}

export default InputSelectCustom;