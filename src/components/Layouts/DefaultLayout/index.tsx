import Navbar from "../Components/Navbar";
import { ReactElement } from "react"
import SideBar from "../Components/Sidebar";
import "./layout.module.scss";


type IProps = {
    children: ReactElement
}

function DefaulLayout({ children }: IProps) {
    return (<>
        <div className="grid grid-cols-12 gap-4">
            <div className="side_bar h-full col-span-3">
                <SideBar />
            </div>
            <div className="content container col-span-9">
                <Navbar />
                <div className="pe-10 pb-8">
                    {children}
                </div>
            </div>
        </div>
    </>);
}

export default DefaulLayout;