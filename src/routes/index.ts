import { DefaultLayout,AuthLayout } from "~/components/Layouts"
import { ForgetPass, HomePage, LoginPage, PlantPage, ProfilePage } from "~/pages"
import DetailPlantDefault from "~/pages/plant/detail/News"
import OutlinePage from "~/pages/outline"
import InputOutlinePage from "~/pages/outline/input"
import ProfileInput from "~/pages/profile/input"
import PageMannger from "~/pages/manager"
import SemesterPage from "~/pages/semester"
import SemesterInput from "~/pages/semester/input"
import DetailSemesterPage from "~/pages/semester/detail"

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
        path:"/outline/:id",
        page: OutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/outline/input",
        page: InputOutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/outline/input/:id",
        page: InputOutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/plant/detail/:id",
        page: DetailPlantDefault,
        layout: DefaultLayout
    },
    
]

export const ADMIN_ROUTER = [
    {
        path:"/manager",
        page: PageMannger,
        layout: DefaultLayout
    },
    {
        path:"/semester",
        page: SemesterPage,
        layout: DefaultLayout
    },
    {
        path:"/semester/detail/:id",
        page: DetailSemesterPage,
        layout: DefaultLayout
    },
    {
        path:"/semester/input",
        page: SemesterInput,
        layout: DefaultLayout
    },
]