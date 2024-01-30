import { ReactElement, useEffect, useState } from "react";
import { PRIVATE_ROUTER, PUBLIC_ROUTER } from "./routes"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAppSelector } from "./redux/hook";
import { isLogin, logging } from "./redux/slices/authSlice";


function App() {
  const isLoginUser = useAppSelector(isLogin);


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
                  <Navigate to="/" />
                  :
                  <Layout>
                    <Page />
                  </Layout>
              }
            />
          })}

          {isLoginUser && PRIVATE_ROUTER.map((item, index) => {
            const Page = item.page;
            return <Route
              key={index}
              path={item.path}
              element={
                <Page />
              }
            />
          })}
          <Route path="*" element={<>NotFound</>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
