import { BookClock, Account, NewspaperVariantMultipleOutline } from 'mdi-material-ui'
import { NavLink, useNavigate } from 'react-router-dom';
import images from '~/assets';
import { useAppDispatch } from '~/redux/hook';
import { logout } from '~/redux/slices/authSlice';

const SIDEBAR_ITEM = [
    {
        url:'/',
        title:"Thông tin cá nhân",
        icon: Account
    },
    {
        url:'/plant',
        title:"Kế hoạch",
        icon: NewspaperVariantMultipleOutline
    },
    {
        url:'/schedule',
        title:"Lịch hàng tuần",
        icon: BookClock
    },
]

function SideBar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout())
    }


    return (<div className="sticky top-0 flex flex-col justify-between items-center w-full h-screen bg-[#fff]">
        <div className="sidebar_top">
            {SIDEBAR_ITEM.map((item)=>{
                const IconItem = item.icon;
                return (
                    <NavLink key={item.url} to={item.url}>
                        {({ isActive }) => {
                            return ((
                                <div  className={`sidebar_list flex justify-center items-center w-full max-h-20 min-h-20 mb-2 cursor-pointer ${isActive ?"bg-light-blue":"" } relative after:content-[''] after:absolute ${isActive ?"after:bg-[#19A7CE]":"" } after:h-full after:rounded-sm after:w-1 after:left-0 after:top-0`}>
                                <div className={`flex items-center flex-col justify-items-center sidebar_item p-2 text-sm font-semibold text-[#333] hover:text-blue-primary ${isActive ?"text-blue-primary":"" }`}>
                                    <IconItem />
                                    <span className="text-center">
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                            ))
                        }}
                        
                    </NavLink>
                )
            })}
            


            {/* <div className="sidebar_list w-full mb-2 cursor-pointer active:bg-light-blue relative after:content-[''] after:absolute active:after:bg-[#19A7CE] after:rounded-sm after:w-1 after:left-0 after:top-3" onClick={()=>navigate("/plant")}>
                <div className="flex items-center flex-col justify-items-center sidebar_item p-2 text-sm font-semibold text-[#333] hover:text-blue-primary">
                    <NewspaperVariantMultipleOutline />
                    <span className="text-center">
                        Kế hoạch đồ án
                    </span>
                </div>
            </div>

            <div className="sidebar_list w-full mb-2 cursor-pointer active:bg-light-blue relative after:content-[''] after:absolute active:after:bg-[#19A7CE] after:rounded-sm after:w-1 after:left-0 after:top-3" onClick={()=>navigate("/schedule")}>
                <div className="flex items-center flex-col justify-items-center sidebar_item p-2 text-sm font-semibold text-[#333] hover:text-blue-primary">
                    <BookClock />
                    <span className="text-center">
                        Lịch hàng tuần
                    </span>
                </div>
            </div> */}
        </div>

        <div className="sidebar_bottom">
            <div className="sidebar_list w-full mb-2 cursor-pointer active:bg-light-blue relative after:content-['']" onClick={()=>{
                handleLogout();
                navigate("/login")
            }}>
                <div className="flex items-center flex-col justify-items-center sidebar_item p-2 text-sm font-semibold text-[#333] hover:text-blue-primary">
                <img className={"w-10 h-10 mb-3 rounded-full object-cover"} src={images.image.anh_demo} alt="" />
                    <span className="text-center">
                        Đăng xuất
                    </span>
                </div>
            </div>
        </div>
    </div>);
}

export default SideBar;