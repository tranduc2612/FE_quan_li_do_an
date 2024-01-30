import IChildType from "~/types/IchildrenType";


function BoxWrapper({ children, classStyle }: IChildType) {
    return (<div className={`shadow-default inline-block rounded-md ${classStyle} `}>
        {children}
    </div>);
}

export default BoxWrapper;