import { Bell } from 'mdi-material-ui'
import React from 'react';
import images from '~/assets';
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '~/redux/slices/authSlice';


function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElNotifi, setAnchorElNotifi] = React.useState<null | HTMLElement>(null);

    const handleLogout = () => {
        dispatch(logout())
    }

    const settings = [{
        id: 0,
        name: "Thông tin cá nhân",
        url: "/profile"
    },
    {
        id: 1,
        name: "kế hoạch đồ án",
        url: "/plant"
    },
    {
        id: 2,
        name: "Đăng xuất",
        url: "/profile",
        func: () => {
            handleLogout();
            navigate("/login")
        }
    }];

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenNotification = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNotifi(event.currentTarget);
    };

    const handleCloseNotification = () => {
        setAnchorElNotifi(null);
    };

    return (<div className="flex justify-between h-12 ps-0 pe-10 py-5 mb-14">
        <h1 className="text-[#333] font-bold text-xl">
            HỆ THỐNG QUẢN LÝ ĐỒ ÁN
        </h1>

        <div className='h-full flex'>
            <div className='cursor-pointer'>
                <div onClick={handleOpenNotification}>
                    <Bell style={
                        {
                            fontSize: "2rem",
                        }
                    } className={`hover:text-yellow-default ${anchorElNotifi ? "text-yellow-default" : ""}`} />
                </div>

                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-noti"
                    anchorEl={anchorElNotifi}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElNotifi)}
                    onClose={handleCloseNotification}
                >
                    <MenuItem onClick={handleCloseNotification}>
                        <span>Thông báo 1</span>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNotification}>
                        <span>Thông báo 2</span>
                    </MenuItem>
                </Menu>
            </div>
            <div className='h-full cursor-pointer ms-3'>
                <img onClick={handleOpenUserMenu} className={"w-8 h-8 max-w-20 rounded-full object-cover"} src={images.image.anh_demo} alt="" />

                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => (
                        <MenuItem key={setting.id} onClick={handleCloseUserMenu}>
                            <div>
                                {
                                    setting?.func ?
                                        <span onClick={setting.func}>{setting.name}</span> :
                                        <Link to={setting.url}>{setting.name}</Link>
                                }

                            </div>

                        </MenuItem>
                    ))}
                </Menu>
            </div>
        </div>
    </div>);
}

export default Navbar;