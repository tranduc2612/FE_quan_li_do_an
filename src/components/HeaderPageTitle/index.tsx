import { HomeOutline } from "mdi-material-ui";

type IProps={
    pageName:string,
    pageChild?: string
}

function HeaderPageTitle({pageName, pageChild}:IProps) {
    return (
        <div className="flex items-center text-sm text-[#fff]">
            <HomeOutline />
            <span className="text-2xl mx-1">/</span>
            <span>{pageName}</span>
            {
                pageChild && <>
                    <span className="text-2xl mx-1">/</span>
                    <span>{pageChild}</span>
                    </>
            }
            
        </div> 
    );
}

export default HeaderPageTitle;