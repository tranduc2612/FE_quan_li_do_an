import { ReactNode } from "react";

type IProps = {
    children: ReactNode
}

function AuthLayout({ children }: IProps) {
    return (<div className="overflow-hidden">
        {children}
    </div>);
}

export default AuthLayout;