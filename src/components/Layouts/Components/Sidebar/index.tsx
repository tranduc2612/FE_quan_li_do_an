import { BookClock, Account, NewspaperVariantMultipleOutline,BookMultipleOutline,Cog,School,AccountSchool, ApplicationOutline, MessageDraw } from 'mdi-material-ui'
import { NavLink, useNavigate } from 'react-router-dom';
import images from '~/assets';
import { useAppDispatch, useAppSelector } from '~/redux/hook';
import { inforUser, logout } from '~/redux/slices/authSlice';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { randomId } from '@mui/x-data-grid-generator';
import { IUser } from '~/types/IUser';
import { getFileAvatar } from '~/services/userApi';


type ISideBar_Type = {
    id:any,
    url: string,
    title: string,
    icon: any,
    role:"TEACHER" | "STUDENT" | "ALL" | "ADMIN",
    isAdmin: number
}

function SideBar() {
    const info = useAppSelector(inforUser)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [avatar,setAvatar] = useState<any>();
    const handleLogout = () => {
        dispatch(logout())
    }

    const fetchApiAvatar = ()=>{
        getFileAvatar(info?.role,info?.userName)
        .then((response:any)=>{
            const blob = response.data;
            const imgUrl = URL.createObjectURL(blob);
            setAvatar(imgUrl);
        })
    }
    
    useEffect(()=>{
        fetchApiAvatar()
    },[info])

    const SIDEBAR_ALL:ISideBar_Type[] = [
        {
            id: randomId(),
            url:'/profile/'+info?.userName,
            title:"Thông tin cá nhân",
            icon: Account,
            role:"ALL",
            isAdmin:0
        },
        {
            id: randomId(),
            url:'/schedule-semester',
            title:"Kế hoạch khoa",
            icon: NewspaperVariantMultipleOutline,
            role: "ALL",
            isAdmin:0
        },
        
    ]

    const SIDEBAR_STUDENT:ISideBar_Type[] = [
        {
            id: randomId(),
            url:'/outline/'+info?.userName,
            title:"Đề cương đồ án",
            icon: BookMultipleOutline,
            role: "STUDENT",
            isAdmin:0
        },
        {
            id: randomId(),
            url:'/schedule-week/'+info?.project?.semesterId,
            title:"Lịch hàng tuần",
            icon: BookClock,
            role: "STUDENT",
            isAdmin:0
        },
    ]

    const SIDEBAR_TEACHER:ISideBar_Type[] = [
        {
            id: randomId(),
            url:'/manager-student-mentor',
            title:"Sinh viên hướng dẫn",
            icon: AccountSchool,
            role: "TEACHER",
            isAdmin:0
        },
        {
            id: randomId(),
            url:'/teacher/group-review',
            title:"Nhóm xét duyệt",
            icon: MessageDraw,
            role: "TEACHER",
            isAdmin:0
        },
        {
            id: randomId(),
            url:'/teacher/council',
            title:"Hội đồng bảo vệ",
            icon: ApplicationOutline,
            role: "TEACHER",
            isAdmin:0
        },
        
    ]

    const SIDEBAR_ADMIN:ISideBar_Type[] = [
        {
            id: randomId(),
            url:'/manager',
            title:"Quản trị",
            icon: Cog,
            role: "ADMIN",
            isAdmin: 1
        },
        {
            id: randomId(),
            url:'/semester',
            title:"Quản lý học kỳ",
            icon: School,
            role: "ADMIN",
            isAdmin: 1
        },
    ]

    return (<div className="sticky top-0 flex flex-col justify-between items-center w-full h-screen  bg-[#fff]">
        <div className="sidebar_top">

            {SIDEBAR_ALL.map((item:ISideBar_Type)=>{
                const IconItem = item.icon;
                return (
                    <NavLink key={item.id} to={item.url}>
                        {({ isActive }) => {
                            return ((
                            <div  className={`sidebar_list flex justify-center items-center w-full max-h-20 min-h-20 mb-2 cursor-pointer ${isActive ?"bg-light-blue":"" } relative after:content-[''] after:absolute ${isActive ?"after:bg-[#19A7CE]":"" } after:h-full after:rounded-sm after:w-1 after:left-0 after:top-0`}>
                                <div className={`flex items-center flex-col justify-items-center sidebar_item p-1 text-xs font-semibold text-[#333] hover:text-primary-blue ${isActive ?"text-primary-blue":"" }`}>
                                    <IconItem />
                                    <span className="text-center mt-1">
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                            ))
                        }}
                    </NavLink>
                )
            })}

            {info?.role === "STUDENT" && SIDEBAR_STUDENT.map((item:ISideBar_Type)=>{
                const IconItem = item.icon;
                return (
                    <NavLink key={item.id} to={item.url}>
                        {({ isActive }) => {
                            return ((
                            <div  className={`sidebar_list flex justify-center items-center w-full max-h-20 min-h-20 mb-2 cursor-pointer ${isActive ?"bg-light-blue":"" } relative after:content-[''] after:absolute ${isActive ?"after:bg-[#19A7CE]":"" } after:h-full after:rounded-sm after:w-1 after:left-0 after:top-0`}>
                                <div className={`flex items-center flex-col justify-items-center sidebar_item p-1 text-xs font-semibold text-[#333] hover:text-primary-blue ${isActive ?"text-primary-blue":"" }`}>
                                    <IconItem />
                                    <span className="text-center mt-1">
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                            ))
                        }}
                    </NavLink>
                )
            })}

            {info?.role === "TEACHER" && SIDEBAR_TEACHER.map((item:ISideBar_Type)=>{
                const IconItem = item.icon;
                return (
                    <NavLink key={item.id} to={item.url}>
                        {({ isActive }) => {
                            return ((
                            <div  className={`sidebar_list flex justify-center items-center w-full max-h-20 min-h-20 mb-2 cursor-pointer ${isActive ?"bg-light-blue":"" } relative after:content-[''] after:absolute ${isActive ?"after:bg-[#19A7CE]":"" } after:h-full after:rounded-sm after:w-1 after:left-0 after:top-0`}>
                                <div className={`flex items-center flex-col justify-items-center sidebar_item p-1 text-xs font-semibold text-[#333] hover:text-primary-blue ${isActive ?"text-primary-blue":"" }`}>
                                    <IconItem />
                                    <span className="text-center mt-1">
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                            ))
                        }}
                    </NavLink>
                )
            })}

            {info?.isAdmin === 1 && SIDEBAR_ADMIN.map((item:ISideBar_Type)=>{
                const IconItem = item.icon;
                return (
                    <NavLink key={item.id} to={item.url}>
                        {({ isActive }) => {
                            return ((
                            <div  className={`sidebar_list flex justify-center items-center w-full max-h-20 min-h-20 mb-2 cursor-pointer ${isActive ?"bg-light-blue":"" } relative after:content-[''] after:absolute ${isActive ?"after:bg-[#19A7CE]":"" } after:h-full after:rounded-sm after:w-1 after:left-0 after:top-0`}>
                                <div className={`flex items-center flex-col justify-items-center sidebar_item p-1 text-xs font-semibold text-[#333] hover:text-primary-blue ${isActive ?"text-primary-blue":"" }`}>
                                    <IconItem />
                                    <span className="text-center mt-1">
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                            ))
                        }}
                    </NavLink>
                )
            })}
        </div>

        <div className="sidebar_bottom">
            <div className="sidebar_list w-full mb-2 cursor-pointer active:bg-light-blue relative after:content-['']" onClick={()=>{
                handleLogout();
                navigate("/login")
            }}>
                <div className="flex items-center flex-col justify-items-center sidebar_item p-2 text-xs text-nowrap font-semibold text-[#333] hover:text-primary-blue">
                {/* <img className={"w-10 h-10 mb-3 rounded-full object-cover"} src={images.image.anh_demo} alt="" /> */}
                    <Avatar alt={info?.fullName} src={avatar} />
                    <span className="text-center mt-3">
                        Đăng xuất
                    </span>
                </div>
            </div>
        </div>
    </div>);
}

export default SideBar;