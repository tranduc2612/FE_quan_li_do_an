import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { DefaultLayout } from "./components/Layouts";
import NotFound from "./pages/notfound";
import { useAppSelector } from "./redux/hook";
import { inforUser, isLogin } from "./redux/slices/authSlice";
import { ADMIN_ROUTER, FIRSTTIME_ROUTER, PRIVATE_ROUTER, PUBLIC_ROUTER, STUDENT_ROUTER, TEACHER_ROUTER } from "./routes";

function App() {
  const isLoginUser = useAppSelector(isLogin);
  const info = useAppSelector(inforUser);
  console.log(info)
  console.log(info?.isFirstTime)

  return (
    <>
      <Router>
        <Routes>
          

          {(isLoginUser && info?.isFirstTime != 1) && PRIVATE_ROUTER.map((item, index) => {
            const Page = item.page;
            const Layout = item.layout || DefaultLayout;
            return <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <Page />
                </Layout>

              }
            />
          })}
        {(isLoginUser && info?.role === "STUDENT" && info?.isFirstTime === 1) && FIRSTTIME_ROUTER.map((item, index) => {
            const Page = item.page;
            const Layout = item.layout || DefaultLayout;
            return <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <Page />
                </Layout>

              }
            />
          })}

          {(isLoginUser && info?.role === "STUDENT" && info?.isFirstTime === 0) && STUDENT_ROUTER.map((item, index) => {
            const Page = item.page;
            const Layout = item.layout || DefaultLayout;
            return <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <Page />
                </Layout>

              }
            />
          })}

          {(isLoginUser && info?.role === "TEACHER") && TEACHER_ROUTER.map((item, index) => {
            const Page = item.page;
            const Layout = item.layout || DefaultLayout;
            return <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <Page />
                </Layout>

              }
            />
          })}

          {(isLoginUser && info?.role === "TEACHER" && info?.isAdmin === 1) && ADMIN_ROUTER.map((item, index) => {
            const Page = item.page;
            const Layout = item.layout || DefaultLayout;
            return <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <Page />
                </Layout>

              }
            />
          })}

          {PUBLIC_ROUTER.map((item, index) => {
            const Page = item.page;
            const Layout = item.layout;
            return <Route
              key={index}
              path={item.path}
              element={
                isLoginUser ?
                <>
                  {
                    info?.role === "STUDENT" && info?.isFirstTime === 1 ?  <Navigate to={"/register-firsttime"} /> : <Navigate to={"/profile/"+info?.userName} />
                  }
                </>
                  :
                  <Layout>
                    <Page />
                  </Layout>
              }
            />
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer className={"text-md font-medium text-[#333]"} />
    </>
  )
}

export default App
