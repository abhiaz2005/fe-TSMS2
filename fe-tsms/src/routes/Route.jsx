import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Students from "../pages/Students";
import About from "../pages/About";
import StudentFees from "../pages/StudentFees";
import PageNotFound from "../pages/PageNotFound";
import Report from '../pages/Report'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Layout ke andar pages */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="students" element={<Students />} />
        <Route path="about" element={<About />} />
        <Route path="report" element={<Report />} />
        <Route path="student/fees" element={<StudentFees />} >
          <Route index element={<StudentFees />} />
          <Route path=":id" element={<StudentFees />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </>
  )
)



