import { Account, BookClock, NewspaperVariantMultipleOutline } from "mdi-material-ui";

export const BASE_URL = 'https://localhost:7274/api/'

export const SIDEBAR_ITEM = [
    {
        url:'/profile/ductm',
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