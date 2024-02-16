import { Link } from "react-router-dom";
import { NoteMultiple } from 'mdi-material-ui'
import IChildType from "~/types/IchildrenType";

interface IProps extends IChildType {
    link: string,
    status: 'now' | 'past' | 'fulture'
};

function BoxItem({ children, classStyle, link, status }: IProps) {
    return (
    <Link to={link} className={`flex items-center shadow-md-light max-h-10 w-full mb-5 mt-5 rounded-sm p-8 transition ease-in-out border text-2xl hover:bg-[#fff] 
                ${status === 'now' ? 'bg-[#5AA469] hover:text-[#5AA469]  hover:border-[#5AA469] text-[#fff]' : ''}  
                ${status === 'fulture' ? 'bg-[#C7C8CC] hover:text-[#52575D]  hover:border-[#C7C8CC] text-[#333]' : ''}
                ${status === 'past' ? 'bg-[#c84f4f] hover:text-[#c84f4f]  hover:border-[#c84f4f] text-[#fff]' : ''}
                ${classStyle}`}>
        <div className="flex items-center content hover:underline font-medium">
            <NoteMultiple className="me-2" />
            {children}
        </div>
    </Link>);
}

export default BoxItem;