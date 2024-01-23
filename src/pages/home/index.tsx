import useSWR, { mutate } from "swr";
import { useAppDispatch } from "~/redux/hook";
import { logout } from "~/redux/slices/authSlice";
import { getAllPosts, handlePosts } from "~/services/blogsApi";
import { IPosts } from "~/types/IBlog";


const keyPost = '/api/user/123';
function Home() {
    const { data, error, isLoading } = useSWR<IPosts[]>(keyPost, getAllPosts, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(logout())
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
    return (<div>
        <button onClick={handleClick}>Click</button>
        <button type="button" onClick={handleLogout}>logout</button>

        {isLoading || !data ? <>Loading san pham</> : data.map((post) => {
            return <div key={Math.random()}>{post.id} {post.title}</div>
        })}
    </div>);
}

export default Home;