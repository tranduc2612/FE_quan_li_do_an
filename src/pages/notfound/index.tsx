import classNames from "classnames/bind";
import style from "./style.module.scss"
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "~/components/Loading";
const cx = classNames.bind(style);
function NotFound() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = setTimeout(() => {
            console.log("run-here")
            navigate("/login")
            setLoading(false);
        }, 2000)

        return () => {
            clearTimeout(id);
        }
    }, [])


    return (<>
        {loading ? <Loading /> : <>
            <section className={cx("error-container")}>
                <span className={cx("four")}><span className={cx("screen-reader-text")}>4</span></span>
                <span className={cx("zero")}><span className={cx("screen-reader-text")}>0</span></span>
                <span className={cx("four")}><span className={cx("screen-reader-text")}>4</span></span>
            </section>
            <h1 className={cx("zoom-area")}>Obbs !!! Trang bạn đang tìm kiếm hiện không có </h1>

            <div className={cx("link-container")}>
                <Link to={"/login"} className={cx("more-link")}>
                    <Button variant="outlined">Đi tới trang chủ</Button>
                </Link>
            </div>
        </>}


    </>);
}

export default NotFound;