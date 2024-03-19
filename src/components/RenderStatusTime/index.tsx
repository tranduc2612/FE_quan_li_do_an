function RenderStatusTime(code?:number) {
    if(code == -1){
        return <span className="text-red-600">Đã quá hạn</span>
    }
    if(code == 0){
        return <span className="text-green-600">Đang diễn ra</span>
    }
    if(code == 1){
        return <span className="text-yellow-600">Chưa diễn ra</span>
    }
    return <>Sai đầu vào</>
}

export default RenderStatusTime;