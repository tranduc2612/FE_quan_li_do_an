import IChildType from "~/types/IchildrenType";


function BoxWrapper({ children,className }: IChildType) {
    return (
        <div className={`relative rounded-xl ${className}`}>
            <div className="absolute rounded-xl top-0 overlay w-full h-full  bg-[#fff] z-0 opacity-90" />
            <div className="relative p-4 z-10">
                {children}
            </div>
        </div>
    );
}

export default BoxWrapper;