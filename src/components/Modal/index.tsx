
interface IProps{
    open?:boolean,
    title?:string,
    textConfirm?:string,
    textClose?:string,
    classNames?:string,
    notifyType?:"DELETE" | "DEFAULT",
    content:any,
    handleSave:()=>void,
    handleClose:()=>void
};


function ModalCustom({handleSave,handleClose,classNames,textClose,textConfirm,title,notifyType = "DEFAULT",content}:IProps) {



    return (
            <div className="modal-box">
                <div className="title mb-10" >
                    <span className="text-xl text-primary-blue font-medium">
                        {title}
                    </span>
                </div>
                <div className={`${classNames}`}>
                    <div className="flex justify-center">
                        <span className="text-xl text-center font-bold">{content}</span>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn bg-slate-900 text-[#fff] hover:bg-white hover:text-slate-900 btn-outline me-4" onClick={handleClose}>
                            {textClose || "Đóng"}
                        </button>
                        <button 
                            className={`btn btn-outline  text-[#fff] hover:bg-white ${notifyType == "DELETE" ? "hover:border-red-500 bg-red-500 hover:text-red-500" : "hover:border-blue-500 bg-blue-500 hover:text-blue-500"}`}
                            onClick={()=>{
                                handleSave();
                                handleClose();
                            }}>
                                {textConfirm || "Lưu chỉnh sửa"}
                        </button>
                    </form>
                </div>
            </div>
            );
}

export default ModalCustom;