import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import "./App.css";
import Admin from "./pages/Add";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import SignIn from "./components/SignIn";
import "bootstrap/dist/css/bootstrap.min.css";
import View from "./components/viewmore";
import ProductDetailPage from "./components/ProductDetailPage";
import VerifyAccount from "./components/VerifyAccount";
import UpdateProduct from "./components/UpdateProduct";
import Layout from "./components/Layout";
import CartPage from "./components/CartPage";
// Add Toastify imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProductPage from "./components/AdminProductPage";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add" element={<Admin />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/viewmore" element={<View />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminProductPage />} />
          <Route path="/admin/update-product/:id" element={<UpdateProduct />} />
          <Route path="/paymentSuccess/:id" element={<PaymentSuccess />} />
        </Route>
      </Routes>

      {/* Toast container for showing notifications globally */}
      <ToastContainer
        position="top-center" // ✅ This centers it at the top
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
