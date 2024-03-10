import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import InputSelectCustom from "~/components/InputSelectCustom";
import {GridPaginationModel, GridRowsProp } from "@mui/x-data-grid";
import TableCustom from "~/components/TableEdit.tsx";
import { useEffect, useState } from "react";
import { ChevronLeft, Loading } from "mdi-material-ui";
import LoadingData from "~/components/LoadingData";
import {IPageProps} from "../index"
import RegisterStudent from "./input";
import { getListStudent } from "~/services/studentApi";
import { getListSemester } from "~/services/semester";
import { getListClassification } from "~/services/classificationApi";
import { IResponse } from "~/types/IResponse";
import { ISemester } from "~/types/ISemesterType";
import { IClassificationType } from "~/types/IClassificationType";
import { getListMajor } from "~/services/majorApi";
import { IMajorType } from "~/types/IMajorType";
const initialRows: GridRowsProp = [
];

function StudentManager({setCurrentPage}:IPageProps) {
    const [lstStudent,setLstStudent] = useState<GridRowsProp>([]);
    const [switchPageInput,setSwitchPageInput] = useState(false);
    const [pageSize,setPageSize] = useState(10);
    const [indexPage,setIndexPage] = useState(0);
    const [semesterOption,setSemesterOption] = useState<ISemester[]>();
    const [statusOption,setstatusOption] = useState<IClassificationType[]>();
    const [majorOptions,setMajorOptions] = useState<IMajorType[]>();

    useEffect(()=>{
        Promise.all([getListSemester(
            {
                semesterId: "",
                nameSemester: ""
            }
        ),getListClassification({
            typeCode: "STATUS_SYSTEM"
        }),getListMajor({
            majorId:"",
            majorName:""
        })])
        .then((responses:IResponse<any>[]) => {
        
            const semesterRes = responses[0];
            const statusRes = responses[1];
            const majorState = responses[2];
            if(semesterRes.success && semesterRes.returnObj && semesterRes.returnObj.length > 0){
                setSemesterOption(semesterRes.returnObj);
                formik.values.semester = semesterRes ? semesterRes.returnObj[0].semesterId : ""
                // formik.setValues({
                //     ...formik.values,
                //     semester: semesterRes ? semesterRes.returnObj[0].semesterId : "",
                // });
            }

            if(statusRes.success && statusRes.returnObj && statusRes.returnObj.length > 0){
                setstatusOption(statusRes.returnObj)
                // formik.setValues({
                //     ...formik.values,
                //     status: !statusRes ? "" : statusRes.returnObj[0].code,
                //   });
                formik.values.status = statusRes ? statusRes.returnObj[0].code : ""
            }

            if(majorState.success && majorState.returnObj && majorState.returnObj.length > 0){
                setMajorOptions(majorState.returnObj)
                // formik.setValues({
                //     ...formik.values,
                //     status: !majorState ? "" : majorState.returnObj[0].code,
                //   });
                formik.values.status = majorState ? majorState.returnObj[0].majorId : "" 
            }
            
          })
    },[]);

    const formik = useFormik({
        initialValues: {
          username: "",
          fullname:"",
          student_code: "",
          major: "",
          status:"",
          semester: "",
          className: "",
          schoolYear:""
        },
        onSubmit: (values) => {
          console.log(values);
        },
    });

    return ( <div className="p-4 overflow-scroll max-h-screen">
           {
            switchPageInput && 
            <div className="mb-4">
                <Button onClick={()=>{setSwitchPageInput(false)}} variant="outlined" startIcon={<ChevronLeft />}>
                    Quay lại
                </Button>
            </div>
           } 
            <h2 className={"font-bold text-primary-blue text-xl mb-5"}>
                {switchPageInput ? "Thêm sinh viên ": "Danh sách sinh viên "}
            </h2>
            {
                switchPageInput ? <RegisterStudent switchPageInput={switchPageInput} setSwitchPageInput={setSwitchPageInput} /> : <div>
                {/* Form tìm kiếm */}
                <form action="" onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3">
                            <InputSelectCustom
                                id={"semester"}
                                name={"semester"}
                                onChange={formik.handleChange}
                                value={formik.values.semester}
                                placeholder="Học kỳ"
                                label="Học kỳ"
                                onBlur={undefined}
                            >
                                {
                                    semesterOption && semesterOption.map(x=>{
                                        return <MenuItem key={x.semesterId} value={x.semesterId}>{x.nameSemester}</MenuItem>
                                    })
                                }
                                
                            </InputSelectCustom>
                        </div>

                        <div className="col-span-3">
                            <TextField
                                onChange={formik.handleChange} 
                                id="name" 
                                label="Tài khoản"
                                name="username"
                                variant="outlined"
                                fullWidth 
                            />
                        </div>

                        <div className="col-span-3">
                            <TextField
                                onChange={formik.handleChange} 
                                id="student_code" 
                                label="Mã sinh viên"
                                name="student_code"
                                variant="outlined"
                                fullWidth 
                            />
                        </div>

                        <div className="col-span-3">
                            <TextField
                                onChange={formik.handleChange} 
                                id="fullname" 
                                label="Họ tên"
                                name="fullname"
                                variant="outlined"
                                fullWidth 
                            />
                        </div>

                        <div className="col-span-3">
                            <TextField
                                onChange={formik.handleChange} 
                                id="className" 
                                label="Lớp"
                                name="className"
                                variant="outlined"
                                fullWidth 
                            />
                        </div>

                        <div className="col-span-3">
                            <TextField
                                onChange={formik.handleChange} 
                                id="schoolYear" 
                                label="Khóa"
                                name="schoolYear"
                                variant="outlined"
                                fullWidth 
                            />
                        </div>

                        <div className="col-span-3">
                            <InputSelectCustom
                                id={"major"}
                                name={"major"}
                                onChange={formik.handleChange}
                                value={formik.values.major}
                                placeholder="Chuyên nghành"
                                label="Chuyên nghành"
                                onBlur={undefined}
                            >
                                {
                                    majorOptions && majorOptions.map((x)=>{
                                        return <MenuItem key={x.majorId} value={x.majorId}>{x.majorName}</MenuItem>
                                    })
                                }
                            </InputSelectCustom>
                        </div>

                        <div className="col-span-3">
                            <InputSelectCustom
                                id={"status"}
                                name={"status"}
                                onChange={formik.handleChange}
                                value={formik.values.status}
                                placeholder="Trạng thái"
                                label="Trạng thái"
                                onBlur={undefined}
                            >
                                 {
                                    statusOption && statusOption.map((x)=>{
                                        return <MenuItem key={x.code} value={x.code}>{x.value}</MenuItem>
                                    })
                                }
                            </InputSelectCustom>
                        </div>
                    </div>

                    <div className="flex justify-between mt-5">
                        <div className="flex">
                            <div className="me-2">
                                <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
                                    Tìm kiếm
                                </Button>
                            </div>
                            <div>
                                <Button variant="text">
                                    <RefreshIcon />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={()=>setSwitchPageInput(true)}>
                                Thêm mới
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Danh sách tìm kiếm */}
                <div className="mt-5">
                        {<TableCustom
                            editMode={undefined}
                            hidePagination={false}
                            dataFind={{
                                userName:  formik.values.username,
                                fullName: formik.values.fullname,
                                studentCode:  formik.values.student_code,
                                majorId: formik.values.major,
                                status: formik.values.status,
                                semesterId: formik.values.semester,
                                className:  formik.values.className,
                                schoolYear: formik.values.schoolYear
                            }}
                            handleCallApi={getListStudent}
                            initalRows={{
                                id: "",
                                student_code: "",
                                username: "",
                                fullname: "",
                                major: "",
                                status_project: "",
                                status: "",
                            }}
                            valueRows={[]}
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
                                    field: 'semester',
                                    headerName: 'Học kỳ',
                                    width: 160,
                                    editable: true,
                                    renderCell:({row})=>{
                                        console.log(row)
                                        return <>{row?.project?.semester?.nameSemester}</>
                                    }
                                },
                                {
                                    field: 'studentCode',
                                    headerName: 'Mã sinh viên',
                                    width: 120,
                                    editable: true,
                                },
                                {
                                    field: 'userName',
                                    headerName: 'Tên tài khoản',
                                    width: 350,
                                    editable: true,
                                },
                                {
                                    field: 'fullName',
                                    headerName: 'Họ và tên',
                                    width: 200,
                                    editable: true,
                                },
                                {
                                    field: 'schoolYearName',
                                    headerName: 'Khóa',
                                    width: 160,
                                    editable: true,
                                },
                                {
                                    field: 'className',
                                    headerName: 'Lớp',
                                    width: 160,
                                    editable: true,
                                },
                                {
                                    field: 'major',
                                    headerName: 'Chuyên nghành',
                                    width: 200,
                                    editable: true,
                                    renderCell:({row})=>{
                                        console.log()
                                        return <>{row?.majorId  ? row?.major?.majorName : "Chưa đăng ký"}</>
                                    }
                                },
                                {
                                    field: 'userNameMentorNavigation',
                                    headerName: 'Giáo viên hướng dẫn',
                                    width: 200,
                                    editable: true,
                                    renderCell:({row})=>{
                                        return <>{row?.project?.userNameMentorNavigation  ? row?.project?.userNameMentorNavigation?.fullName : "Chưa được gán"}</>
                                    }
                                },
                                {
                                    field: 'ss',
                                    headerName: 'Hội đồng phòng thi',
                                    width: 200,
                                    editable: true,
                                    renderCell:({row})=>{
                                        console.log()
                                        return <>{"Chưa có"}</>
                                    }
                                },
                                {
                                    field: 'userNameCommentatorNavigation',
                                    headerName: 'Giáo viên phản biện',
                                    width: 200,
                                    editable: true,
                                    renderCell:({row})=>{
                                        return <>{row?.project?.userNameCommentatorNavigation  ? row?.project?.userNameCommentatorNavigation?.fullName : "Chưa được gán"}</>
                                    }
                                },
                                {
                                    field: 'status_project',
                                    headerName: 'Trạng thái làm đồ án',
                                    width: 160,
                                    editable: true,
                                },
                                {
                                    field: 'status',
                                    headerName: 'Trạng thái tài khoản',
                                    width: 160,
                                    editable: true,
                                },
                                ]} 
                                pageSize={pageSize} 
                                page={indexPage}
                            /> 
                            // :
                            //     <LoadingData />                       
                        }
                            
                </div>
            </div>
            }
            
    </div> );
}

export default StudentManager;