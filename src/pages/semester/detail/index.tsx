import { Button } from "@mui/material";
import { ChevronLeft } from "mdi-material-ui";
import { useNavigate } from "react-router-dom";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import PlantSemester from "./plant-semester";
import AccordionCustom from "~/components/AccordionCustom";
import Add from "@mui/icons-material/Add";
import GroupOutlineReview from "./group-outline-review";
import CouncilSemester from "./council";

function DetailSemesterPage() {
    const navigate = useNavigate();
    
    return ( <>
        <HeaderPageTitle pageName="Quản lý học kỳ" pageChild="Chi tiết" />
        {/* <BoxWrapper className={"mb-5"}>
            <>
                <div className="mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                </div>
                <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                    Kế hoạch học kỳ
                </h2>
                <div>
                    <PlantSemester />
                </div>
            </>
        </BoxWrapper> */}

        <div className="mb-5">
            <AccordionCustom inititalToggle={true} header={<>
                    <div className="mb-5">
                        <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                                Quay lại
                        </Button>
                    </div>
                    <h2 className={"font-bold text-primary-blue text-xl"}>
                        Kế hoạch học kỳ
                    </h2>
                    </>} size={"xxl"}>
                    <div>
                        <PlantSemester />
                    </div>
            </AccordionCustom>
        </div>

        <div className="mb-5">
            <AccordionCustom inititalToggle={true} header={"Danh sách nhóm đọc duyệt"} size={"xxl"}>
                <GroupOutlineReview />
            </AccordionCustom>
        </div>

        <div className="mb-5">
            <AccordionCustom inititalToggle={true} header={"Danh sách hội đồng bảo vệ"} size={"xxxl"}>
                <CouncilSemester />
            </AccordionCustom>
        </div>
    </>  );
}

export default DetailSemesterPage;