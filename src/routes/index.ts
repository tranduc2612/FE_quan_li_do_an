import { DefaultLayout,AuthLayout } from "~/components/Layouts"
import { ForgetPass, HomePage, LoginPage, ProfilePage } from "~/pages"

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
        page: HomePage,
        layout: DefaultLayout
    },
    {
        path:"/profile/:id",
        page: ProfilePage,
        layout: DefaultLayout
    }
]