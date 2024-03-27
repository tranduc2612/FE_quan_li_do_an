import { ReactElement, useEffect, useState } from "react";
import { ADMIN_ROUTER, PRIVATE_ROUTER, PUBLIC_ROUTER, STUDENT_ROUTER, TEACHER_ROUTER } from "./routes"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAppSelector } from "./redux/hook";
import { isLogin,inforUser } from "./redux/slices/authSlice";
import NotFound from "./pages/notfound";
import { DefaultLayout } from "./components/Layouts";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const isLoginUser = useAppSelector(isLogin);
  const info = useAppSelector(inforUser);
  console.log(info)
  return (
    <>
      <Router>
        <Routes>
          {PUBLIC_ROUTER.map((item, index) => {
            const Page = item.page;
            const Layout = item.layout;
            return <Route
              key={index}
              path={item.path}
              element={
                isLoginUser ?
                  <Navigate to={"/profile/"+info?.userName} />
                  :
                  <Layout>
                    <Page />
                  </Layout>
              }
            />
          })}

          {(isLoginUser) && PRIVATE_ROUTER.map((item, index) => {
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

          {(isLoginUser && info?.role === "STUDENT") && STUDENT_ROUTER.map((item, index) => {
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer className={"text-md font-medium text-[#333]"} />
    </>
  )
}

export default App
