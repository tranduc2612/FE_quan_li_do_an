import { HomePage, LoginPage } from "~/pages"

export const PUBLIC_ROUTER = [
    {
        path:"/login",
        page: LoginPage
    }
]

export const PRIVATE_ROUTER = [
    {
        path:"/",
        page: HomePage
    }
]