import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
type IProps = {
    id:string,
    label: string,
    value?: string | number,
    name: string,
    isError: boolean | undefined,
    errorMessage: any,
    type?:string,
    onChange: any,
    onBlur: any,
    placeholder?: string,
    multiline?:boolean,
    readOnly?:boolean,
    disabled?:boolean
}


const CssTextField = styled(TextField)({
    '&': {
        width: '100%',
    },
    '& .MuiFormHelperText-root':{
        fontSize:"0.89rem",
        margin: '0px'
    },
    '& textarea::placeholder':{
        whiteSpace:"pre-wrap"
    },
    '& ~ &': {
        marginTop: '20px',
        marginBottom: '10px'
    },
    '& label': {
        zIndex: '99',
        color: '#b8b8ba',

    },
    '& label.Mui-focused': {
        color: '#333',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#E0E3E7',
            width: "100%",
        },
        '&:hover fieldset': {
            borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#71a6cc',
        },
    },
});

function InputCustom({
    label,
    id,
    name,
    value,
    type = 'text',
    isError,
    errorMessage,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    readOnly = false,
    multiline = false
}: IProps) {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    

    return (<>
        <CssTextField
            id={id}
            error={isError}
            value={value}
            type={type}
            name={name}
            label={label}
            placeholder={placeholder}
            onChange={onChange}
            helperText={errorMessage}
            onBlur={onBlur}
            onKeyDown={(e)=>{
                if(type == 'number'){
                    e.preventDefault();
                }
            }}
            InputProps={{
                readOnly: readOnly,
                inputProps: { min: 1, max: 50 }
            }}
            disabled={disabled}
            multiline={multiline}
            fullWidth
            
        >
            
        </CssTextField>
    </>);
}

export default InputCustom;