import BoxWrapper from "~/components/BoxWrap";

function PlantPage() {
    return (<>
        <div className="mb-10">
            <h2 className="font-bold text-2xl text-[#333]">DANH SÁCH KẾ HOẠCH ĐANG HOẠT ĐỘNG</h2>

            <div style={{
                height: "1px",
            }} className="w-full mb-7 bg-[#BFB29E] rounded" />

            <BoxWrapper link={"/"} classStyle={""} status={"now"}>
                <div className="">Kế hoạch đăng ký đề tài</div>
            </BoxWrapper>
            <BoxWrapper link={"/to"} classStyle={""} status={"now"}>
                <div className="">Giảng viên hướng dẫn duyệt</div>
            </BoxWrapper>
        </div>

        <div className="mb-10">
            <h2 className="font-bold text-2xl text-[#333]">DANH SÁCH KẾ HOẠCH ĐANG SẮP TỚI</h2>

            <div style={{
                height: "1px",
            }} className="w-full mb-7 bg-[#BFB29E] rounded" />

            <BoxWrapper link={"/to"} classStyle={""} status={"fulture"}>
                <div className="">Thành lập hội đồng</div>
            </BoxWrapper>
            <BoxWrapper link={"/to"} classStyle={""} status={"fulture"}>
                <div className="">Phân giáo viên phản biện</div>
            </BoxWrapper>
        </div>

        <div className="mb-10">
            <h2 className="font-bold text-2xl text-[#333]">DANH SÁCH KẾ HOẠCH ĐANG ĐÃ KẾT THÚC</h2>

            <div style={{
                height: "1px",
            }} className="w-full mb-7 bg-[#BFB29E] rounded" />

            <BoxWrapper link={"/to"} classStyle={""} status={"past"}>
                <div className="">Kế hoạch đăng ký đề tài</div>
            </BoxWrapper>
            <BoxWrapper link={"/to"} classStyle={""} status={"past"}>
                <div>
                    <div className="">Kế hoạch đăng ký đề tài</div>
                </div>
            </BoxWrapper>
        </div>
    </>);
}

export default PlantPage;