import { Link } from "react-router-dom";
import { NoteMultiple } from 'mdi-material-ui'
import IChildType from "~/types/IchildrenType";


function BoxWrapper({ children,classStyle }: IChildType) {
    return (
        <div className={`relative rounded-xl ${classStyle}`}>
            <div className="absolute rounded-xl top-0 overlay w-full h-full  bg-[#fff] z-0 opacity-80" />
            <div className="relative p-4 z-10">
                {children}
            </div>
        </div>
    );
}

export default BoxWrapper;