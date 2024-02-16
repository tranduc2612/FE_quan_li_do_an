import useSWR, { mutate } from "swr";
import { useAppDispatch } from "~/redux/hook";
import { logout } from "~/redux/slices/authSlice";
import { getAllPosts, handlePosts } from "~/services/blogsApi";
import { IPosts } from "~/types/IBlog";
import classNames from "classnames/bind";
import style from "./Home.module.scss"
import { useNavigate } from "react-router-dom";
import BoxWrapper from "~/components/BoxWrap";


const keyPost = '/api/user/123';
const cx = classNames.bind(style);

function Home() {
    const navigate = useNavigate();

    const { data, error, isLoading } = useSWR<IPosts[]>(keyPost, getAllPosts, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(logout())
        navigate("/login");
    }

    if (error) return <div>Xảy ra lỗi</div>

    const handleClick = async () => {
        const dataSubmit: IPosts = {
            id: "s",
            title: 'ssd'
        }
        const data = await handlePosts(dataSubmit);
        console.log(data);
        mutate(keyPost);
    }
    return (
        <div>
            <BoxWrapper classStyle={""}>
            {/* <button className="bg-blue-700 ms-3 p-6 rounded-xl" onClick={handleClick}>Click</button>
            <button className="bg-blue-700 ms-3 p-6 rounded-xl" type="button" onClick={handleLogout}>logout</button> */}

                {/* {isLoading || !data ? <>Loading san pham</> : data.map((post) => {
                    return <div key={Math.random()}>{post.id} {post.title}</div>
                })} */}
                <div className="overflow-y-scroll h-32 text-[#333]">
                    {isLoading || !data ? <>Loading san pham</> : data.map((post) => {
                    return <div key={Math.random()}>{post.id} {post.title}</div>
                })}
                </div>

            </BoxWrapper>
        </div>
    );
}

export default Home;