import { DefaultLayout,AuthLayout } from "~/components/Layouts"
import { ForgetPass, HomePage, LoginPage, PlantPage, ProfilePage } from "~/pages"
import DetailPlantDefault from "~/pages/plant/detail"
import RegisterTopic from "~/pages/plant/detail/RegisterTopic"

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
        path:"/plant",
        page: PlantPage,
        layout: DefaultLayout
    },
    {
        path:"/plant/detail/register-topic",
        page: RegisterTopic,
        layout: DefaultLayout
    },
    {
        path:"/plant/detail",
        page: DetailPlantDefault,
        layout: DefaultLayout
    }
]