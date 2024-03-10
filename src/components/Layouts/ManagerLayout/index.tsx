import Navbar from "../Components/Navbar";
import { ReactElement } from "react"
import SideBar from "../Components/Sidebar";
import "./layout.module.scss";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";


type IProps = {
    children: ReactElement
}

function ManagerLayout({ children }: IProps) {
    const infoUser = useAppSelector(inforUser)?.username;

    return (<>
        <div className="grid grid-cols-22">
            <div className="side_bar h-full col-span-1 max-w-20 z-50">
                <SideBar userName={infoUser} />
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

export default ManagerLayout;