import { HomeOutline } from "mdi-material-ui";

type IProps={
    pageName:string,
    pageChild?: string,
    detailChild?: string
}

function HeaderPageTitle({pageName, pageChild, detailChild}:IProps) {
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

{
                detailChild && <>
                    <span className="text-2xl mx-1">/</span>
                    <span>{detailChild}</span>
                    </>
            }
            
        </div> 
    );
}

export default HeaderPageTitle;