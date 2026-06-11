import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Students from "../pages/admin/Students";
import About from "../pages/About";
import StudentFees from "../pages/admin/StudentFees";
import PageNotFound from "../pages/PageNotFound";
import Report from "../pages/admin/Report";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import RegisterForm from "../pages/RegisterForm";
import Exams from "../pages/admin/Exams";
import Classes from "../pages/admin/Classes";
import Subjects from "../pages/admin/Subjects";
import StudentReportView from "../pages/users/StudentReportView";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<RegisterForm />} />

      <Route path="/" element={<Layout />}>
        {/* PUBLIC */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />


        {/* ADMIN ONLY */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="report" element={<Report />} />
          <Route path="exams" element={<Exams />} />
          <Route path="students" element={<Students />} />
          <Route path="student/fees" element={<StudentFees />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/subject" element={<Subjects />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="students/fees/:id" element={<StudentFees />} />
          <Route path="students/:id" element={<Students />} />
          <Route path="students/report/:id" element={<StudentReportView />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </>
  ),
);
