import "./../styles/CartSummary.css";
import { toast } from "react-toastify";
import apiCaller from "../utils/apiCaller"; // adjust path if needed

const CartSummary = ({ items, cartId }) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      toast.error("Please log in to proceed with checkout.");
      return;
    }
    const backend = import.meta.env.VITE_BACKEND_URL;
    const response = await apiCaller(
      `${backend}/payment/checkout`,
      `${backend}/user/refreshJWT`,
      accessToken,
      refreshToken,
      "POST",
      {},
      { cartId }
    );

    if (response.success && response.data?.url) {
      toast.success("Redirecting to secure payment...");
      setTimeout(() => {
        window.location.href = response.data.url;
      }, 1000); // brief delay to let user see the toast
    } else {
      toast.error(response.err || "Checkout failed. Please try again.");
    }
  };

  return (
    <div className="cart-summary">
      <h3>Subtotal: ₹{total.toFixed(2)}</h3>
      <button className="checkout-btn" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;
