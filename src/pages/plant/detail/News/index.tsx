import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import Button from '@mui/material/Button';
import { ChevronLeft } from "mdi-material-ui";
import {
    useNavigate,
  } from 'react-router-dom';
import MiniBox from "~/components/MiniBox";
function DetailPlantDefault() {
    const navigate = useNavigate();
    return (
    <>
        <HeaderPageTitle pageName={"Kế hoạch đồ án"} pageChild="Chi tiết"/>
        <BoxWrapper className={"mb-5"}>
            <div>
                <div className="mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                </div>

                <div className={"flex flex-col content"}>
                    <h2 className={"header font-bold text-primary-blue text-2xl"}>
                        Chi tiết nội dung của bài viết
                    </h2>

                    <div className="font-normal  text-base text-primary-blue">
                        2 ngày trước (26/12/2023)
                    </div>

                    <div className={"mt-8 mb-8 text-base text-text-color"}>
                        - GVHD hướng dẫn sinh viên sửa đề cương theo 
                        góp ý của Nhóm xét duyệt.
                        <br />
                        - Sinh viên nộp 02 bản đề cương đồ án có chữ ký 
                        của GVHD cho cô Đào VPK thời gian thực hiện 
                        muộn nhất ngày 10/03/2024
                        <br />
                        Trân trọng !
                    </div>

                    <MiniBox className="" header={<span className="text-primary-blue">Tệp đính kèm</span>}>
                        <div className="list_file">
                            <div className="flex flex-col cursor-pointer ps-2 pt-4 pb-2 rounded-sm border border-gray-300">
                                <span className="name_file mb-1 text-sm text-primary-blue font-medium">128737912389197823971.jpg</span>
                                
                                <span className="file_size text-xs font-medium">15.83 KB</span>
                            </div>
                        </div>
                    </MiniBox>
                </div>
            </div>
        </BoxWrapper>
    </>);
}

export default DetailPlantDefault;