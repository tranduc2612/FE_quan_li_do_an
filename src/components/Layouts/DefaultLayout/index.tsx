import Navbar from "../Components/Navbar";
import { ReactElement } from "react"
import SideBar from "../Components/Sidebar";
import "./layout.module.scss";


type IProps = {
    children: ReactElement
}

function DefaulLayout({ children }: IProps) {
    return (<>
        <div className="grid grid-cols-24">
            <div className="side_bar h-full col-span-1 max-w-16 z-50">
                <SideBar />
            </div>
            <div className="content container h-full min-w-full col-span-23 z-50">
                <div className="pb-8 px-4 mt-10 overflow-scroll h-screen">
                    {children}
                </div>
            </div>
            {/* <div className="overlay w-full h-full absolute bg-[#fff] opacity-20 z-0" /> */}
        </div>
    </>);
}

export default DefaulLayout;