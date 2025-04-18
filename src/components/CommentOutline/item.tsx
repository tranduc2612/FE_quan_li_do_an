import { Avatar, TextField } from "@mui/material";
import { Check, Delete, Pencil } from "mdi-material-ui";
import { useEffect, useState } from "react";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { getFileAvatar } from "~/services/userApi";
import { ICommentType } from "~/types/IComment";
import { formatDate } from "~/ultis/common";

type IProps = {
    item: ICommentType,
    handleDelete: (id:string)=>void,
    handleUpdate: (req: ICommentType) => void,
}

function ItemCommentOutline({item,handleDelete,handleUpdate}: IProps) {
    const info = useAppSelector(inforUser)
    const [switchEdit,setSwitchEdit] = useState(false);
    const [avatar,setAvatar] = useState<any>()
    const [valueInput,setValueInput] = useState(item?.contentComment || "");

    useEffect(()=>{
        fetchApiAvatar()
    },[])

    const handleUpdateComment = async ()=>{
        const req: ICommentType = {
            commentId: item?.commentId,
            contentComment: valueInput,
            createdBy: item?.createdBy,
            userName: item?.userName
        }
        await handleUpdate(req)
        setSwitchEdit(false)
    }

    const fetchApiAvatar = ()=>{
        getFileAvatar("TEACHER",item?.createdBy)
        .then((response:any)=>{
            const blob = response.data;
            const imgUrl = URL.createObjectURL(blob);
            setAvatar(imgUrl);
        })
    }

    return ( <>
        <div key={item?.commentId} className="grid grid-cols-6 mb-8">
                <Avatar 
                    alt="Remy Sharp" 
                    src={avatar}  
                    sx={{ width: 40, height: 40, marginTop: 1 }}>
                        
                </Avatar>
                {/* <img src={images.image.anh_demo} className={`col-span-1 rounded-full w-10 h-10 object-cover`} /> */}
                <span className="content col-span-5">
                    <div className="flex justify-between text-primary-blue font-bold">
                        <span>{item?.createdByNavigation?.fullName}</span>
                        {
                            info?.userName === item?.createdBy &&
                            <div className="flex">
                                {
                                    switchEdit 
                                    ? 
                                    <div className="cursor-pointer hover:bg-slate-200 rounded-full mx-2" onClick={handleUpdateComment}>
                                        <Check className="text-green-600" />
                                    </div>
                                    : 
                                    <div className="cursor-pointer hover:bg-slate-200 rounded-full mx-2" onClick={()=>{
                                        setSwitchEdit(true)
                                    }
                                        }>
                                        <Pencil className="text-blue-600" />
                                    </div>
                                }

                                <div className="cursor-pointer hover:bg-slate-200 rounded-full mx-2" onClick={()=>{
                                    if(item?.commentId){
                                        handleDelete(item?.commentId)
                                    }
                                }}>
                                    <Delete className="text-red-600"/>
                                </div>
                            </div>
                        }
                    </div>
                    {
                        switchEdit ? <>
                            <TextField 
                                id="comment_edit" 
                                label="Nhận xét đề cương" 
                                variant="standard"
                                value={valueInput}
                                onChange={(e)=>{
                                    setValueInput(e.target.value);
                                }}
                                multiline 
                                fullWidth
                            />
                        </> :
                        <span className="whitespace-pre-wrap">
                            {valueInput}
                        </span>
                    }
                    <div className="flex mt-1">
                        <span className="text-primary-blue">
                            {formatDate(item?.createdDate)}
                        </span>

                        
                    </div>
                </span>
            </div>
    
    </> );
}

export default ItemCommentOutline;