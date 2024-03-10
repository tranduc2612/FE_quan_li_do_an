import React from "react";
import BoxWrapper from "../BoxWrap";
import { EnumPage, IPageAdmin } from "~/pages/manager";



type IProps = {
    currentPage: EnumPage,
    setCurrentPage:(value: EnumPage) => void,
    lstItemSidebar : IPageAdmin[],
    expand:boolean
}

function SidebarAdmin({lstItemSidebar,currentPage,setCurrentPage,expand}:IProps) {
    return ( 
            <BoxWrapper className="">
                <div>
                    {lstItemSidebar && lstItemSidebar.map((item)=>{
                        const IconItem = item.icon;
                        return <div key={item.id} className={`flex items-center cursor-pointer sidebar_item px-2 py-3 
                        text-md font-medium hover:text-primary-blue ${currentPage === item.id ? "text-primary-blue" : "text-[#333]"}`}
                            onClick={(elem)=>{
                                setCurrentPage(item.id)
                            }}
                        >
                            <IconItem />
                            {
                                expand && <span className="ms-2">
                                {item.title}
                            </span>
                            }
                            
                        </div>
                    })}
                </div>
            </BoxWrapper>
 );
}

export default SidebarAdmin;