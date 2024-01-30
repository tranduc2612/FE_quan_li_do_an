import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
type IProps = {
    label: string,
    onClick: () => void
}

function ButtonCustom({
    label,
    onClick
}: IProps) {
    const StyledButton = styled(Button)({
        '&': {
            height: '40px',
            // backgroundColor: "#71a6cc"
        },
        '&:hover': {
            // backgroundColor: "black"
        }
    });
    return (<>
        <StyledButton className="w-full" variant="contained" onClick={() => onClick()}>{label}</StyledButton>
    </>);
}

export default ButtonCustom;