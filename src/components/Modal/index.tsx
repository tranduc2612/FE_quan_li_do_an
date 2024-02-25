import { useEffect, useId, useLayoutEffect, useRef } from "react";
import IChildType from "~/types/IchildrenType";

interface IProps extends IChildType{
    id:string,
    open:boolean,
    title:string,
    handleSave:()=>void,
    handleClose:()=>void
};

function ModalCustom({id,open,handleSave,handleClose,children,className,title}:IProps) {
    const refElem = useRef<HTMLDialogElement>(null);

    useLayoutEffect(()=>{
        console.log(refElem)
        if(open){
            refElem.current?.showModal()
        }
    },[open])

    return ( <>
        <dialog key={id} id={id} ref={refElem} className="modal">
            <div className="modal-box">
                <div className="title mb-10">
                    <span className="text-xl text-primary-blue font-medium">
                        {title}
                    </span>
                </div>
                <div className={`${className}`}>
                    {children}
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-outline me-4" onClick={handleClose}>Đóng</button>
                        <button 
                            className="btn btn-outline hover:border-blue-500 bg-blue-500 text-[#fff] hover:text-blue-500 hover:bg-white" 
                            onClick={()=>{
                                handleSave();
                                handleClose();
                            }}>Lưu chỉnh sửa
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    </> );
}

export default ModalCustom;