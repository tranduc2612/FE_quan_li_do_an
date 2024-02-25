import { DefaultLayout,AuthLayout } from "~/components/Layouts"
import { ForgetPass, HomePage, LoginPage, PlantPage, ProfilePage } from "~/pages"
import DetailPlantDefault from "~/pages/plant/detail/News"
import OutlinePage from "~/pages/plant/detail/Outline"
import InputOutlinePage from "~/pages/plant/detail/Outline/input"
import ProfileInput from "~/pages/profile/input"

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
    },
    {
        path:"/profile/input/:id",
        page: ProfileInput,
        layout: DefaultLayout
    },
    {
        path:"/plant",
        page: PlantPage,
        layout: DefaultLayout
    },
    {
        path:"/plant/detail/outline/:id",
        page: OutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/plant/detail/outline/input",
        page: InputOutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/plant/detail/outline/input/:id",
        page: InputOutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/plant/detail/:id",
        page: DetailPlantDefault,
        layout: DefaultLayout
    }
]