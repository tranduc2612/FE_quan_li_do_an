import { IconButton, InputAdornment } from '@mui/material';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
type IProps = {
    id:string,
    label: string,
    value?: string,
    placeholder: string
    name: string,
    onChange: any,
    onBlur: any,
    children:any
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
    placeholder
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
        >
            {children}
        </CssTextField>
    </FormControl>
    </>);
}

export default InputSelectCustom;