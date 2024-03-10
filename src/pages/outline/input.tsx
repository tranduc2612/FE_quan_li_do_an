import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import { Button, InputLabel, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil,PrinterCheck } from "mdi-material-ui";

function InputOutlinePage() {
    const navigate = useNavigate();

    return ( <>
        <HeaderPageTitle pageName="Đề cương đồ án" />
        <BoxWrapper className={""}>
            <div>
                <div className="flex justify-between w-full mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                    <div>
                        <Button onClick={()=>{navigate(-1)}} variant="contained" startIcon={<PrinterCheck />}>
                            In
                        </Button>
                    </div>
                </div>

                <div>
                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                        Nội dung đề cương
                    </h2>

                    <div className={"grid grid-cols-4"}>
                        <div className={"col-span-4 m-3"}>
                            <TextField
                                id="outlined-textarea"
                                label="Tên đề tài"
                                placeholder=""
                                fullWidth
                            />
                        </div>

                        <div className={"col-span-4 m-3"}>
                            <TextField
                                id="outlined-textarea"
                                label="Nội dung công việc"
                                placeholder="Đề cập đến phạm vi của bài toán"
                                multiline
                                fullWidth
                            />
                        </div>

                        <div className={"col-span-4 m-3"}>
                            <TextField
                                id="outlined-textarea"
                                label="Công nghệ, công cụ và ngôn ngữ lập trình"
                                placeholder=""
                                multiline
                                fullWidth
                            />
                        </div>

                        <div className={"col-span-4 m-3"}>
                            <TextField
                                id="outlined-textarea"
                                label="Kết quả chính dự kiến đạt được"
                                placeholder="Dự kiến kế quả của em sau khi hoàn thành đồ án VD: Đồ án A cho B dùng được"
                                multiline
                                fullWidth
                            />
                        </div>

                        <div className={"col-span-4 m-2"}>
                            <b className={"text-primary-blue"}>Kế hoạch thực hiện đề tài</b>
                        </div>
                        <div className={"col-span-4 m-2 px-20"}>
                            <table className="w-full table-fixed">
                                <thead>
                                    <tr>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">STT</th>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">Nội dung công việc</th>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">Thời gian dự kiến</th>
                                        <th className="border border-primary-blue bg-blue-100 text-primary-blue">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
        
                                    <tr>
                                        <td className="border border-primary-blue text-center">1</td>
                                        <td className="border border-primary-blue p-2 break-words">Lorem ipsum ipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsum dolor sit amet,dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet,</td>
                                        <td className="border border-primary-blue text-center">26/12/2023 - 30/12/2023</td>
                                        <td className="border border-primary-blue p-2 break-words"></td>
                                        </tr>
                                    <tr>
                                        <td className="border border-primary-blue text-center">3</td>
                                        <td className="border border-primary-blue p-2 break-words">Lorem ipsum dolor sit amet,dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet, dolor sit amet,</td>
                                        <td className="border border-primary-blue text-center">26/12/2023 - 30/12/2023</td>
                                        <td className="border border-primary-blue p-2 break-words">lnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksaldalnsaadsknlasdnksalda</td>
                                    </tr>
                                </tbody>
                            </table>

                            
                        </div>
                    </div>
                           
                </div>
            </div>
        </BoxWrapper>

    </> );
}

export default InputOutlinePage;