import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Students from "../pages/Students";
import About from "../pages/About";
import StudentFees from "../pages/StudentFees";
import PageNotFound from "../pages/PageNotFound";
import Report from "../pages/Report";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import RegisterForm from "../pages/RegisterForm";

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
          <Route path="students" element={<Students />} />

          <Route path="student/fees" element={<StudentFees />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "STAFF"]} />}>
          <Route path="student/fees/:id" element={<StudentFees />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </>
  ),
);
