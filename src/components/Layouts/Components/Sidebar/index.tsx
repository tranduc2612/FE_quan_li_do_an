import { Bell } from 'mdi-material-ui'
import { Link } from 'react-router-dom';
import images from '~/assets';

function SideBar() {
    return (<div className="sticky top-0 flex flex-col justify-center items-center w-full pt-5 pe-3 pb-5">
        <Link to="/" className="logo w-2/6 mb-5">
            <img className="" src={images.logo.logo_remvbg} alt="" />
        </Link>

        <div style={{
            height: "1px"
        }} className="w-5/6 bg-[#34343421] rounded" />

        <div className="sidebar_list w-full mt-5 mb-2 cursor-pointer hover:bg-gray-default hover:ps-2 ease-in duration-300 rounded-e-full active:bg-gray-default">
            <div className="sidebar_item p-2 text-xl font-bold text-[#333] hover:text-yellow-default">
                Thông tin cá nhân
            </div>
        </div>

        <div className="sidebar_list w-full mb-2 cursor-pointer hover:bg-gray-default hover:ps-2 ease-in duration-300 rounded-e-full active:bg-gray-default">
            <div className="sidebar_item p-2 text-xl font-bold text-[#333] hover:text-yellow-default">
                Kế hoạch đồ án
            </div>
        </div>

        <div className="sidebar_list w-full mb-2 cursor-pointer hover:bg-gray-default hover:ps-2 ease-in duration-300 rounded-e-full active:bg-gray-default">
            <div className="sidebar_item p-2 text-xl font-bold text-[#333] hover:text-yellow-default">
                Lịch hàng tuần
            </div>
        </div>
    </div>);
}

export default SideBar;