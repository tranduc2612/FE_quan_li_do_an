import { isCurrentTimeInRange } from "~/ultis/common"

export interface IProps {
    fromDate?:string,
    toDate?:string,
    data?:any
}

function RenderStatusApply({fromDate,toDate,data}:IProps) {
    const code = isCurrentTimeInRange(new Date(fromDate || ""),new Date(toDate || ""))
    if(code== undefined) {
        return <></>
    }
    if(code == -1){
        return <span className="text-red-600">Đã quá hạn</span>
    }
    if(data){
        return <span className="text-green-600">Đúng hạn</span>
    }
    return <span className="text-yellow-600">Chưa nộp báo cáo</span>
}

export default RenderStatusApply;