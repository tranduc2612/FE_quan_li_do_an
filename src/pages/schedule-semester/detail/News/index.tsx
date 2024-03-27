import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import Button from '@mui/material/Button';
import { ChevronLeft } from "mdi-material-ui";
import {
    useNavigate, useParams,
  } from 'react-router-dom';
import MiniBox from "~/components/MiniBox";
import { useEffect, useState } from "react";
import { getScheduleSemester } from "~/services/scheduleSemesterApi";
import { IResponse } from "~/types/IResponse";
import { IScheduleSemester } from "~/types/IScheduleSemester";
import Loading from "~/components/Loading";
import { dateShowNotification } from "~/ultis/common";
function ScheduleSemester() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [data,setData] = useState<IScheduleSemester>();
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        setLoading(true);
        if(id){
            getScheduleSemester(id)
            .then((res:IResponse<IScheduleSemester>)=>{
                console.log(res)
                if(res.returnObj && res.success){
                    setData(res.returnObj)
                }
                setLoading(false)
            })
        }
    },[])

    return (
    <>
    {loading ? <><Loading /></> : 
    
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
                    {/* <h2 className={"header font-bold text-primary-blue text-2xl"}>
                        Chi tiết nội dung của bài viết
                    </h2> */}

                    <div className="font-normal  text-base text-primary-blue">
                        {dateShowNotification(data?.fromDate,data?.toDate)}
                    </div>

                    <div className={"mt-8 mb-8 text-base text-text-color"} style={{
                        whiteSpace:"pre-wrap"
                    }}>
                        {
                            data?.content
                        }
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
    </>
    }
    </>);
}

export default ScheduleSemester;