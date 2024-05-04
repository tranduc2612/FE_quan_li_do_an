import { Link } from "react-router-dom";

interface IProps{
    header: string,
    dateTime: string,
    className: string,
    link: string,
    active: boolean,
};

function ScheduleItem({className, link, active, header,dateTime }: IProps) {
    return (
    <div className={`mb-4 last:mb-0 cursor-pointer border-solid border rounded-md min-h-16 ${!active ? "bg-gray-200 border-gray-200 hover:bg-gray-300 hover:border-gray-200":"border-primary-blue hover:border-[#2074b085] hover:bg-light-blue"}`}>
        <Link to={link} className={`${className}`}>
            <div className={`flex transition ease-linear p-2`}>
                <div className="info flex flex-col-reverse justify-end text-primary-blue font-bold">
                    <div style={{
                        // lineHeight: "2rem",
                        // maxHeight: "4rem",
                        // overflow: "hidden",
                        // display: "-webkit-box",
                    }} className="text-lg line-clamp-1">
                        {header}
                    </div>

                    <div className="font-normal text-sm">
                        {dateTime}
                    </div>
                </div>
            </div>
        </Link>

    </div>);
}

export default ScheduleItem;