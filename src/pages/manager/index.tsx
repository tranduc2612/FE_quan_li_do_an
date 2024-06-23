import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import { AccountSchool, ChevronLeft, ChevronRight, HumanMaleBoard } from 'mdi-material-ui';
import { FC, useState } from "react";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import SidebarAdmin from "~/components/SidebarAdmin";
import StudentManager from "./student";
import TeacherMannager from "./teacher";
import TemplateFile from "./template-file";
import MajorManage from './major';
import EducationManage from './education';
export enum EnumPage{
    STUDENT,
    TEACHER,
    MAJOR,
    EDUCATION,
    TEMPLATE_FILE,
    PARAM_SYSTEM
}

export interface IPageProps {
    setCurrentPage: (page: EnumPage) => void;
}

export interface IPageAdmin {
    id: EnumPage;
    title:string,
    page: FC<IPageProps>,
    icon: any,
}

function PageMannger() {
    const [pageItem,setPageItem] = useState<IPageAdmin[]>([
        {
            id: EnumPage.STUDENT,
            title:"Quản lý sinh viên",
            icon: AccountSchool,
            page: StudentManager
        },
        {
            id:EnumPage.TEACHER,
            title:"Quản lý giảng viên",
            icon: HumanMaleBoard,
            page:TeacherMannager
        },
        {
            id:EnumPage.MAJOR,
            title:"Quản lý chuyên ngành",
            icon: ViewHeadlineIcon,
            page: MajorManage
        },
        {
            id:EnumPage.EDUCATION,
            title:"Quản lý học vị",
            icon: ViewHeadlineIcon,
            page: EducationManage
        },
        // {
        //     id:EnumPage.GROUP_REVIEW_OUTLINE,
        //     title:"Quản lý nhóm đọc duyệt",
        //     icon: FormatListGroup,
        //     page:GroupReviewOutlineManager
        // },
        {
            id:EnumPage.TEMPLATE_FILE,
            title:"Quản lý biểu mẫu",
            icon: TextSnippetIcon,
            page: TemplateFile
        },
        // {
        //     id:EnumPage.PARAM_SYSTEM,
        //     title:"Cấu hình tham số hệ thống",
        //     icon: ViewHeadlineIcon,
        //     page: TemplateFile
        // }
    ]);
    const [expand,setExpand] = useState(true);
    const [currentPage,setCurrentPage] = useState<EnumPage>(EnumPage.STUDENT)
    return ( 
        <div>
            <HeaderPageTitle pageName={"Quản trị"}/>
            <div className="grid grid-cols-12 gap-4 overflow-hidden">
                <div className={`transition-all ease-in-out relative h-3/5 ${expand ? "col-span-3" : "col-span-1"}`}>
                    <SidebarAdmin 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        lstItemSidebar={pageItem}
                        expand={expand} 
                    />
                    <div className="after:w-8 after:h-8 after:absolute after:-right-2 after:top-3 cursor-pointer z-20" onClick={()=>setExpand(!expand)}>
                        {
                            expand ? 
                            <ChevronLeft className="absolute !w-8 !h-8 -right-2 top-3 bg-white rounded-full z-10"/> : 
                            <ChevronRight className="absolute !w-8 !h-8 -right-2 top-3 bg-white rounded-full z-10"/>
                        }
                    </div>
                  

                </div>
                <div className={`transition-all ease-in-out col-span-11 ${expand ? "col-span-9" : "col-span-11"}`}>
                    {/* <BoxWrapper className="max-h-full"> */}
                        <div>
                            {pageItem.map(item=>{
                                const Page:any = item.page;
                                if(item.id === currentPage){
                                    return <Page key={item.id} setCurrentPage={setCurrentPage} />
                                }
                                return <div key={item.id}></div>
                            })}
                        </div>
                    {/* </BoxWrapper> */}
                </div>
            </div>
        </div> 
    );
}

export default PageMannger;