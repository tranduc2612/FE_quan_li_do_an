import { ReactNode } from "react";
import "./Authen.module.scss"
type IProps = {
    children: ReactNode
}

function AuthLayout({ children }: IProps) {
    return (<div className="overflow-hidden no-scrollbar">
        {children}
    </div>);
}

export default AuthLayout;