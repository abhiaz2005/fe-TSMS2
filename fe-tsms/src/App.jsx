import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import PageNotFound from "./pages/PageNotFound";
import Students from "./pages/Students";
import Report from "./pages/Report";
import StudentFees from "./pages/StudentFees";
import Layout from "./components/layout/Layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Layout ke andar pages */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="students" element={<Students />} />
        <Route path="about" element={<About />} />
        <Route path="report" element={<Report />} />
        <Route path="student/fees" element={<StudentFees />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </>
  )
)

function App() {
  return (
    <>
      
      <RouterProvider router={router} />
    </>
  );
}

export default App;
