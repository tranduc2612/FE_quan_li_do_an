import IChildType from "~/types/IchildrenType";

interface IProps extends IChildType{
    header:any;
}

function MiniBox({children,className,header}:IProps) {
    return ( <div className={`p-1 rounded-sm border border-gray-300  ${className}`}>
        <div className="relative p-2 after:absolute after:w-full after:left-0 after:bottom-0 after:h-[1px] after:bg-gray-300">
            {header}
        </div>
        <div className="mt-2">
            {children}
        </div>
    </div> );
}

export default MiniBox;