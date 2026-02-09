import { RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { router } from "./routes/Route.jsx";
import { AuthProvider } from "./contexts/authcontext/AuthContext.jsx";

function App() {
  return (
    <>
      <AuthProvider>
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
      </AuthProvider>
    </>
  );
}

export default App;
