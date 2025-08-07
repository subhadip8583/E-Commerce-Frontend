import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import "./../styles/CartPage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiCaller from "../utils/apiCaller"; // Assuming you have a utility function for API calls
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate for redirection

const CartPage = () => {
  const [cartId, setCartId] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const backend = import.meta.env.VITE_BACKEND_URL;

    const result = await apiCaller(
      `${backend}/item/my-cart`,
      `${backend}/user/refreshJWT`,
      accessToken,
      refreshToken,
      "GET"
    );

    

    if (!result.success) {
      toast.error(result.message || result.err || "Failed to load cart.");

      if (
        result.err === "Session expired. Please log in again." ||
        result.err === "Session expired after retry. Please log in again."
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/signin");
      }

      return;
    }

    try {
      const items = result.data?.items;
      setCartId(result?.data?.cart?._id);

      if (!Array.isArray(items)) {
        throw new Error("items is not an array");
      }

      const flatItems = items
        .filter((entry) => entry.item !== null)
        .map((entry) => ({
          ...entry.item,
          quantity: entry.quantity,
          _id: entry.item._id,
        }));

      setItems(flatItems);
    } catch (err) {
      console.error("Cart structure error:", err);
      toast.error("Cart data is invalid.");
    }
  };

  useEffect(() => {
    loadCart(); // ✅ now navigate is safely inside component
  }, []);

  // ✅ Update quantity in backend

  const handleQuantityChange = async (id, qty) => {
    if (qty <= 0) {
      toast.warn("Quantity must be at least 1.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const backend = import.meta.env.VITE_BACKEND_URL;

    const result = await apiCaller(
      `${backend}/item/modify-cart`,
      `${backend}/user/refreshJWT`,
      accessToken,
      refreshToken,
      "PUT",
      {
        "Content-Type": "application/json",
      },
      {
        itemId: id,
        quantity: qty,
      },
      false // not FormData
    );

    if (!result || !result.success) {
      toast.error(
        result?.message || result?.err || "Failed to update quantity."
      );

      // ✅ Redirect to signin if session expired
      if (
        result?.err === "Session expired. Please log in again." ||
        result?.err === "Session expired after retry. Please log in again."
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/signin");
      }

      return;
    }

    toast.success("Quantity updated.");
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: qty } : item))
    );
  };

  // ✅ Delete item from backend
  const handleDelete = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const backend = import.meta.env.VITE_BACKEND_URL;

    const result = await apiCaller(
      `${backend}/item/cart/item/${id}`,
      `${backend}/user/refreshJWT`,
      accessToken,
      refreshToken,
      "DELETE",
      {
        accesstoken: accessToken, // This will be replaced in apiCaller if token refreshes
      },
      {},
      false // no body, no FormData
    );

    if (!result || !result.success) {
      toast.error(result?.message || result?.err || "Failed to remove item.");

      if (
        result?.err === "Session expired. Please log in again." ||
        result?.err === "Session expired after retry. Please log in again."
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/signin");
      }

      return;
    }

    toast.success("Item removed from cart.");
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="cart-container">
      <div className="cart-items">
        {items.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onQtyChange={handleQuantityChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <CartSummary items={items} cartId={cartId} />
    </div>
  );
};

export default CartPage;
