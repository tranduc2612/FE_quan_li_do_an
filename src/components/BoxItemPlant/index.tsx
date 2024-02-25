import { Link } from "react-router-dom";
import { TrashCanOutline,Pencil } from 'mdi-material-ui'
import IChildType from "~/types/IchildrenType";

interface IProps{
    header: string,
    dateTime: string,
    className: string,
    link: string,
    active: boolean,
};

function BoxItem({className, link, active, header,dateTime }: IProps) {
    return (
    <div className="mb-4 last:mb-0">
        <Link to={link} className={`${className}`}>
            <div className={`flex items-center justify-between transition ease-linear cursor-pointer border-solid border rounded-md p-2 ${!active ? "bg-gray-200 border-gray-200 hover:bg-gray-300 hover:border-gray-200":"border-primary-blue hover:border-[#2074b085] hover:bg-light-blue"}`}>
                <div className="info flex flex-col justify-around text-primary-blue font-bold">
                    <div className="text-lg">
                        {header}
                    </div>

                    <div className="font-normal text-sm ">
                        {dateTime}
                    </div>
                </div>

                <div className="flex tools">
                    <div className="flex items-center p-2 rounded-full text-3xl me-2 hover:bg-gray-200">
                        <Pencil className="text-primary-blue" />
                    </div>
                    <div className="flex items-center p-2 rounded-full text-3xl me-2 hover:bg-gray-200">
                        <TrashCanOutline className="text-[red]" />
                    </div>
                </div>
            </div>
        </Link>

    </div>);
}

export default BoxItem;