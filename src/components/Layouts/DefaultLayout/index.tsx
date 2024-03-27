import Navbar from "../Components/Navbar";
import { ReactElement } from "react"
import SideBar from "../Components/Sidebar";
import "./layout.module.scss";
import { inforUser } from "~/redux/slices/authSlice";
import { useAppSelector } from "~/redux/hook";


type IProps = {
    children: ReactElement
}

function DefaulLayout({ children }: IProps) {
    const info = useAppSelector(inforUser);

    return (<>
        <div className="grid grid-cols-22">
            <div className="side_bar h-full col-span-1 max-w-20 z-50">
                <SideBar userName={info?.userName} />

            </div>
            <div className="content container h-full min-w-full col-span-21 z-50">
                <div className="pb-8 px-4 mt-10 overflow-scroll h-screen">
                    {children}
                </div>
            </div>
            {/* <div className="overlay w-full h-full absolute bg-[#fff] opacity-20 z-0" /> */}
        </div>
    </>);
}

export default DefaulLayout;