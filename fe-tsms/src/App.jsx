import { RouterProvider } from "react-router-dom";
import {ToastContainer} from 'react-toastify' 
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { router } from "./routes/Route.jsx";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
