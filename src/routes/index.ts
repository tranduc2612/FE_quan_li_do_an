import AuthLayout from "~/components/Layouts/AuthenLayout"
import { ForgetPass, HomePage, LoginPage } from "~/pages"

export const PUBLIC_ROUTER = [
    {
        path:"/login",
        page: LoginPage,
        layout: AuthLayout
    },
    {
        path:"/forget-password",
        page: ForgetPass,
        layout: AuthLayout
    },    
]

export const PRIVATE_ROUTER = [
    {
        path:"/",
        page: HomePage
    }
]