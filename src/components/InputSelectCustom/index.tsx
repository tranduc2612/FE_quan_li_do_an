import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
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
    readOnly?:boolean,
    disabled?:boolean
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
    disabled,
    readOnly
}: IProps) {
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
            disabled={disabled}
        >
            {children}
        </CssTextField>
    </FormControl>
    </>);
}

export default InputSelectCustom;