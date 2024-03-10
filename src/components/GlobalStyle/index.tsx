// import { ReactElement } from 'react';
import { ReactElement } from 'react';
import "./index.scss"
import 'react-toastify/dist/ReactToastify.css';

type PropsType = {
    children: ReactElement
}


function GlobalStyle({ children }: PropsType) {
    return (<>
        {children}
    </>);
}

export default GlobalStyle;