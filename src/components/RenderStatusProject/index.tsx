function RenderStatusProject({code}:any) {
    console.log(code)
    if(code === "REJECT"){
        return <span className="text-red-600">Không được bảo vệ</span>
    }
    if(code === "START"){
        return <span className="text-green-600">Mới tạo</span>
    }
    if(code === "DOING"){
        return <span className="text-green-600">Đang làm đồ án</span>
    }
    if(code === "ACCEPT"){
        return <span className="text-green-600">Được bảo vệ</span>
    }
    if(code === "PAUSE"){
        return <span className="text-yellow-600">Bảo lưu đồ án</span>
    }
    return <></>
}

export default RenderStatusProject;