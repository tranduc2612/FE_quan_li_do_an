import { ReactElement } from "react";
import { PRIVATE_ROUTER, PUBLIC_ROUTER } from "./routes"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAppSelector } from "./redux/hook";
import { isLogin, logging } from "./redux/slices/authSlice";


function App() {
  const isLoginUser = useAppSelector(isLogin);
  const isLogining = useAppSelector(logging);
  // console.log(isLoginUser)
  if (isLogining) {
    return <>Loading....</>
  }
  return (
    <>
      <Router>
        <Routes>
          {PUBLIC_ROUTER.map((item, index) => {
            const Page = item.page;
            return <Route
              key={index}
              path={item.path}
              element={
                isLoginUser ?
                  <Navigate to="/" />
                  :
                  <Page />
              }
            />
          })}

          {PRIVATE_ROUTER.map((item, index) => {
            const Page = item.page;
            return <Route
              key={index}
              path={item.path}
              element={
                isLoginUser ?
                  <Page />
                  :
                  <Navigate to="/login" />
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
