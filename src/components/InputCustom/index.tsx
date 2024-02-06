import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
type IProps = {
    label: string,
    value: string,
    name: string,
    isError: boolean,
    errorMessage: string,
    onChange: (value: string) => void
}

const CssTextField = styled(TextField)({
    '&': {
        width: '100%',
    },
    "#standard-error-helper-text-helper-text": {
        margin: "0px",
        fontSize: "0.89rem"
    },
    '& ~ &': {
        marginTop: '20px',
        marginBottom: '10px'
    },
    '& label': {
        zIndex: '99',
        color: '#333',

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
    name,
    value,
    isError,
    errorMessage,
    onChange,
}: IProps) {

    return (<>
        <CssTextField
            id="standard-error-helper-text"
            error={isError}
            value={value}
            name={name}
            helperText={errorMessage}
            label={label}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
    </>);
}

export default InputCustom;