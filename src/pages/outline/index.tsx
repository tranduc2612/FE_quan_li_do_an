import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";
import { Button, InputLabel, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil,PrinterCheck } from "mdi-material-ui";
import TableCustom from "~/components/TableEdit.tsx";
import TableView from "~/components/TableView";
import { GridRenderCellParams, GridRowModes, GridRowsProp, GridToolbarContainer } from "@mui/x-data-grid";
import CustomEditComponent from "~/components/TableEdit.tsx/TextLines";
import ExpandableCell from "~/components/TableEdit.tsx/ExpandableCell";

function OutlinePage() {
    const navigate = useNavigate();

    

    const initialRows: GridRowsProp = [
        {
          id: 1,
          content: "Xây dựng website hỗ trợ học tập kết hợp việc sử dụng flashcard với phương pháp học “lặp lại ngắt quãng” để tạo ra một môi trường học tập tương tác. Người học có thể tạo các flashcard điện tử. Trang web sẽ cung cấp các chức năng như quản lý flashcard, kiểm tra và đánh giá khả năng ghi nhớ, đồng thời tính toán thời điển cần ôn tập lại dựa trên phương pháp “lặp lại ngắt quãng” để nhắc người học về thời điểm cần ôn tập lại kiến thức.",
          timeStart: new Date(),
          timeEnd: new Date(),
          note: "Pellentesque vestibulum eget turpis dictum tincidunt. Morbi ornare consectetur imperdiet. Suspendisse non vulputate ligula. Curabitur rhoncus sit amet mi ut finibus. Vestibulum suscipit scelerisque dolor, at consectetur justo rhoncus sit amet. Pellentesque elementum gravida vehicula. Duis sodales mi a quam ultrices dapibus. Duis nibh sapien, posuere vitae mattis a, imperdiet vel odio. Aenean in arcu egestas, bibendum mi vel, vestibulum risus. Donec tincidunt justo vel quam hendrerit, vel convallis orci faucibus. Morbi viverra metus vitae nibh lacinia, sed consequat ligula iaculis. Proin sodales pulvinar tristique.Pellentesque vestibulum eget turpis dictum tincidunt. Morbi ornare consectetur imperdiet. Suspendisse non vulputate ligula. Curabitur rhoncus sit amet mi ut finibus. Vestibulum suscipit scelerisque dolor, at consectetur justo rhoncus sit amet. Pellentesque elementum gravida vehicula. Duis sodales mi a quam ultrices dapibus. Duis nibh sapien, posuere vitae mattis a, imperdiet vel odio. Aenean in arcu egestas, bibendum mi vel, vestibulum risus. Donec tincidunt justo vel quam hendrerit, vel convallis orci faucibus. Morbi viverra metus vitae nibh lacinia, sed consequat ligula iaculis. Proin sodales pulvinar tristique.Pellentesque vestibulum eget turpis dictum tincidunt. Morbi ornare consectetur imperdiet. Suspendisse non vulputate ligula. Curabitur rhoncus sit amet mi ut finibus. Vestibulum suscipit scelerisque dolor, at consectetur justo rhoncus sit amet. Pellentesque elementum gravida vehicula. Duis sodales mi a quam ultrices dapibus. Duis nibh sapien, posuere vitae mattis a, imperdiet vel odio. Aenean in arcu egestas, bibendum mi vel, vestibulum risus. Donec tincidunt justo vel quam hendrerit, vel convallis orci faucibus. Morbi viverra metus vitae nibh lacinia, sed consequat ligula iaculis. Proin sodales pulvinar tristique.",
        },
        {
          id: 2,
          content: 2,
          timeStart: new Date(),
          timeEnd: new Date(),
          note: "",
        },
        {
          id: 3,
          content: 3,
          timeStart: new Date(),
          timeEnd: new Date(),
          note: "",
        },
        {
          id: 4,
          content: 4,
          timeStart: new Date(),
          timeEnd: new Date(),
          note: "",
        },
        {
          id: 5,
          content: 5,
          timeStart: new Date(),
          timeEnd: new Date(),
          note: "",
        },
      ];

    return ( <>
        <HeaderPageTitle pageName="Đề cương đồ án"/>
        <BoxWrapper className={""}>
            <div>
                <div className="flex justify-between w-full mb-5">
                    <Button onClick={()=>{navigate(-1)}} variant="outlined" startIcon={<ChevronLeft />}>
                            Quay lại
                    </Button>
                    <div>
                        <div className="flex items-center p-2 rounded-full text-3xl me-2 hover:bg-gray-200" onClick={()=>{navigate("/outline/input")}}>
                            <Pencil className="text-primary-blue cursor-pointer" />
                        </div>
                        {/* <Button onClick={()=>{navigate(-1)}} variant="contained" startIcon={<PrinterCheck />}>
                            In
                        </Button> */}
                    </div>
                </div>

                <div>
                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                        Giáo viên hướng dẫn
                    </h2>

                    <div className={"grid grid-cols-9"}>
                        <div className={"col-span-3 m-2"}>
                            <b>Họ và tên:</b> <span className={"text-text-color"}>Nguyễn Hiếu Cường</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Số điện thoại:</b> <span className={"text-text-color"}>1234567890</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Email:</b> <span className={"text-text-color"}>ductm@gmail.com</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Chuyên ngành:</b> <span className={"text-text-color"}>Công nghệ phần mềm</span> 
                        </div>

                        <div className={"col-span-3 m-2"}>
                            <b>Học hàm:</b> <span className={"text-text-color"}>Thạc sĩ</span> 
                        </div>
                    </div>

                    <h2 className={"font-bold text-primary-blue text-xl mb-2"}>
                        Nội dung đề cương
                    </h2>

                    <div className={"grid grid-cols-4"}>
                        <div className={"col-span-4 m-2"}>
                            <b>Tên đề tài:&#160;</b>
                            <span className={"text-text-color"}>Quản lý đồ án</span>
                        </div>

                        <div className={"col-span-4 m-2"}>
                            <b>Công nghệ sử dụng:</b>
                            <br/>
                            <span className={"text-text-color"}>Loremollis. Etiam placerat dui in </span> 
                        </div>

                        <div className={"col-span-4 m-2"}>
                            <b>Nội dung đề tài:</b> 
                            <br/>
                            <span className={"text-text-color"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut velit ac neque fermentum commodo. Phasellus a ultrices nisi. Nullam sit amet arcu nec sapien volutpat ullamcorper sit amet vel purus. Ut mollis ultrices ante sit amet aliquet. Suspendisse potenti. Nam felis diam, malesuada sit amet erat mattis, consequat volutpat quam. Cras odio ligula, porta id tincidunt a, molestie quis felis. Donec ac volutpat neque. Cras lacinia convallis augue, ut rhoncus diam consequat a. Aliquam erat volutpat. In euismod egestas quam, convallis feugiat nulla ullamcorper eget.
                            Pellentesque vestibulum eget turpis dictum tincidunt. Morbi ornare consectetur imperdiet. Suspendisse non vulputate ligula. Curabitur rhoncus sit amet mi ut finibus. Vestibulum suscipit scelerisque dolor, at consectetur justo rhoncus sit amet. Pellentesque elementum gravida vehicula. Duis sodales mi a quam ultrices dapibus. Duis nibh sapien, posuere vitae mattis a, imperdiet vel odio. Aenean in arcu egestas, bibendum mi vel, vestibulum risus. Donec tincidunt justo vel quam hendrerit, vel convallis orci faucibus. Morbi viverra metus vitae nibh lacinia, sed consequat ligula iaculis. Proin sodales pulvinar tristique.
        Curabitur finibus rutrum ligula ac rutrum. Fusce tincidunt ex metus, nec elementum felis efficitur at. In hac habitasse platea dictumst. Morbi facilisis tempor mollis. Etiam placerat dui in diam tempor euismod. Maecenas convallis magna sed turpis facilisis, a fermentum mi tincidunt. Suspendisse at augue rhoncus, vestibulum leo sed, volutpat turpis. Duis mollis non justo lacinia suscipit. Integer id magna auctor, rhoncus dolor id, molestie justo. Donec posuere lectus at turpis placerat, nec luctus libero malesuada. Vivamus egestas quam id quam convallis, quis dapibus augue tincidunt. Nam dolor leo, ultrices non enim in, commodo pharetra metus. Praesent ligula turpis, auctor ut blandit non, suscipit consectetur felis. Duis sit amet elementum </span> 
                        </div>

                        <div className={"col-span-4 m-2"}>
                            <b>Các kết quả chính dự kiến đạt được:</b> 
                            <br/>
                            <span className={"text-text-color"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut velit ac neque fermentum commodo. Phasellus a ultrices nisi. Nullam sit amet arcu nec sapien volutpat ullamcorper sit amet vel purus. Ut mollis ultrices ante sit amet aliquet. Suspendisse potenti. Nam felis diam, malesuada sit amet erat mattis, consequat volutpat quam. Cras odio ligula, porta id tincidunt a, molestie quis felis. Donec ac volutpat neque. Cras lacinia convallis augue, ut rhoncus diam consequat a. Aliquam erat volutpat. In euismod egestas quam, convallis feugiat nulla ullamcorper eget.
                            Pellentesque vestibulum eget turpis dictum tincidunt. Morbi ornare consectetur imperdiet. Suspendisse non vulputate ligula. Curabitur rhoncus sit amet mi ut finibus. Vestibulum suscipit scelerisque dolor, at consect</span> 
                        </div>

                        <div className={"col-span-4 m-2"}>
                            <b>Kế hoạch thực hiện đề tài</b>
                        </div>
                        
                    </div>
                    <div className={"px-32"}>
                        <TableCustom
                            editMode={undefined}
                            hidePagination={true}
                            initalRows={{
                                content: "",
                                timeStart: new Date(),
                                timeEnd: new Date(),
                                note: "",
                            }}
                            // editMode="row"
                            valueRows={initialRows}
                            columns={[
                                {
                                    field: 'id',
                                    headerName: 'STT',
                                    width: 80,
                                    maxWidth: 60,
                                    flex: 1,
                                    editable: true,
                                },
                                {
                                    field: 'content',
                                    headerName: 'Nội dung',
                                    width: 600,
                                    // flex: 1,
                                    align: 'left',
                                    headerAlign: 'left',
                                    editable: true,
                                    renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
                                    renderEditCell: (props) => <><CustomEditComponent {...props} />
                                    </>
                                },
                                {
                                    field: 'timeStart',
                                    headerName: 'Từ ngày',
                                    type: 'date',
                                    width: 100,
                                    flex: 1,
                                    editable: true,
                                },
                                {
                                    field: 'timeEnd',
                                    headerName: 'Đến ngày',
                                    type: 'date',
                                    width: 100,
                                    flex: 1,
                                    editable: true,
                                },
                                {
                                    field: 'note',
                                    headerName: 'Ghi chú',
                                    width: 50,
                                    flex: 1,
                                    headerAlign: 'left',
                                    editable: true,
                                    renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />,
                                    renderEditCell: (props) => <><CustomEditComponent {...props} />
                                    </>
                                },
                            ]} pageSize={99} page={0}                            /> 
                    </div>
                          
                </div>
            </div>
        </BoxWrapper>

    </> );
}

export default OutlinePage;