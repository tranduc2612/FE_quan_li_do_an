import { DefaultLayout,AuthLayout } from "~/components/Layouts"
import { ForgetPass, HomePage, LoginPage, ProfilePage } from "~/pages"
import ScheduleSemester from "~/pages/schedule-semester/detail/News"
import OutlinePage from "~/pages/outline"
import InputOutlinePage from "~/pages/outline/input"
import ProfileInput from "~/pages/profile/input"
import PageMannger from "~/pages/manager"
import SemesterPage from "~/pages/semester"
import SemesterInput from "~/pages/semester/input"
import DetailSemesterPage from "~/pages/semester/detail"
import GroupReviewOutlineDetail from "~/pages/semester/detail/group-outline-review/detail"
import EditOutlinePage from "~/pages/outline/edit"
import ManageStudentMentor from "~/pages/manage-student-mentor"
import ScheduleWeek from "~/pages/schedule-week"
import ScheduleSemesterPage from "~/pages/schedule-semester"
import ScheduleWeekInput from "~/pages/schedule-week/input"
import ScheduleWeekDetail from "~/pages/schedule-week/detail"
import DetailReviewMentor from "~/pages/review-template/mentor"
import InputReviewMentor from "~/pages/review-template/mentor/input"
import DetailReviewCommentor from "~/pages/review-template/commentator"
import InputReviewCommentor from "~/pages/review-template/commentator/input"
import DetailCouncil from "~/pages/semester/detail/council/detail"
import TeacherCouncil from "~/pages/council/teacher"
import TeacherGroupReview from "~/pages/group-review-outline"

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
        path:"/schedule-semester",
        page: ScheduleSemesterPage,
        layout: DefaultLayout
    },
    {
        path:"/schedule-week/:idSemester",
        page: ScheduleWeek,
        layout: DefaultLayout
    },
    {
        path:"/schedule-semester/detail/:id",
        page: ScheduleSemester,
        layout: DefaultLayout
    },
    {
        path:"/schedule-week/detail/:id",
        page: ScheduleWeekDetail,
        layout: DefaultLayout
    },
    {
        path:"/schedule-week/detail/:id/:idStudent",
        page: ScheduleWeekDetail,
        layout: DefaultLayout
    },
    {
        path:"/outline/:id",
        page: OutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/review-mentor/",
        page: DetailReviewMentor,
        layout: DefaultLayout
    },
    {
        path:"input/review-mentor/",
        page: InputReviewMentor,
        layout: DefaultLayout
    },
    {
        path:"/review-commentator/",
        page: DetailReviewCommentor,
        layout: DefaultLayout
    },
    {
        path:"input/review-commentator/",
        page: InputReviewCommentor,
        layout: DefaultLayout
    },
]

export const STUDENT_ROUTER = [
    
    {
        path:"/outline/input",
        page: InputOutlinePage,
        layout: DefaultLayout
    },
    {
        path:"/outline/input/:id",
        page: EditOutlinePage,
        layout: DefaultLayout
    },
]

export const TEACHER_ROUTER = [
    {
        path:"/",
        page: HomePage,
        layout: DefaultLayout
    },
    {
        path:"/manager-student-mentor",
        page: ManageStudentMentor,
        layout: DefaultLayout
    },
    {
        path:"/schedule-week/input/:idSemester",
        page: ScheduleWeekInput,
        layout: DefaultLayout
    },
    {
        path:"/schedule-week/edit/:idScheduleWeek",
        page: ScheduleWeekInput,
        layout: DefaultLayout
    },
    {
        path:"/teacher/council",
        page: TeacherCouncil,
        layout: DefaultLayout
    },
    {
        path:"/teacher/group-review",
        page: TeacherGroupReview,
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
        path:"/semester/detail/group-reivew/:idSemester/:idGroup",
        page: GroupReviewOutlineDetail,
        layout: DefaultLayout
    },
    {
        path:"/semester/detail/council/:idSemester/:idCouncil",
        page: DetailCouncil,
        layout: DefaultLayout
    },
    {
        path:"/semester/input",
        page: SemesterInput,
        layout: DefaultLayout
    },
]