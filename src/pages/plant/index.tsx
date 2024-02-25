import BoxItem from "~/components/BoxItemPlant";
import BoxWrapper from "~/components/BoxWrap";
import HeaderPageTitle from "~/components/HeaderPageTitle";

function PlantPage() {
    return (<>
        <HeaderPageTitle pageName={"Kế hoạch đồ án"} />
        <BoxWrapper className="">
            <div>
                <div className="plant-content mb-6">
                    <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                        Kế hoạch đang thực hiện
                    </h2>
                    <div className="plant-now">
                        <BoxItem link={"detail/2"} active={true} className={"mb-5"} header={"Kế hoạch đồ án năm"} dateTime={"2 ngày trước (26/12/2023 - 30/12/2023)"} />
                        <BoxItem link={"detail/outline/2"} active={true} className={""} header={"Đề cương đồ án"} dateTime={"2 ngày trước (26/12/2023 - 30/12/2023)"} />
                    </div>
                </div>

                <div className="plant-content mb-6">
                    <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                        Kế hoạch kết thúc
                    </h2>
                    <div className="plant-now">
                        <BoxItem link={"detail/2"} active={false} className={""} header={"Kế hoạch đồ án năm"} dateTime={"2 ngày trước (26/12/2023 - 30/12/2023)"} />
                    </div>
                </div>

                <div className="plant-content mb-6">
                    <h2 className={"font-bold text-primary-blue text-xl mb-3"}>
                        Kế hoạch sắp tới
                    </h2>
                    <div className="plant-now">
                        <BoxItem link={"detail/2"} active={false} className={""} header={"Kế hoạch đồ án năm"} dateTime={"2 ngày trước (26/12/2023 - 30/12/2023)"} />
                    </div>
                </div>
            </div>
        </BoxWrapper>
    </>);
}

export default PlantPage;