import { useEffect, useState } from "react";
import styles from "./../styles/AdminProductPage.module.css";
import { useNavigate } from "react-router-dom";
import apiCaller from "../utils/apiCaller";
import { toast } from "react-toastify";
import checkUserRole from "../utils/checkUserRole";


const AdminProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

   useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();

    const verifyAccess = async () => {
      const result = await checkUserRole();
      if (!result.success || result.type !== "admin") {
        toast.warning("Please login as an admin");
        navigate("/"); // redirect if not a user
      }
    };

    verifyAccess();
  }, []);

  const fetchProducts = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND_URL; // ✅ use env var
      const res = await fetch(`${backend}/item/getItemDetails`);

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      if (Array.isArray(data.items)) {
        setProducts(data.items);
      } else {
        console.error("Expected array at data.items, got:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setProducts([]);
    }
  };

  const handleAddProduct = () => {
    navigate("/add");
  };

   const handleUpdate = (productId) => {
    navigate(`/admin/update-product/${productId}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      toast.error("Access denied. Please log in as admin.");
      navigate("/signin");
      return;
    }

    const result = await apiCaller(
      `${import.meta.env.VITE_BACKEND_URL}/item/deleteItem/${id}`,
      `${import.meta.env.VITE_BACKEND_URL}/user/refreshJWT`,
      accessToken,
      refreshToken,
      "DELETE"
    );

    if (
      !result.success &&
      result.err === "Session expired. Please log in again."
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.error("Session expired. Please log in again.");
      navigate("/signin");
      return;
    }

    if (result.success) {
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } else {
      console.error("Delete error:", result.err);
      toast.error("Error: " + result.err);
    }
  };

  return (
    <div className={styles.adminPage}>
      <header className={styles.adminHeader}>
        <h1>Admin Product Dashboard</h1>
        <button className={styles.addProductBtn} onClick={handleAddProduct}>
          + Add Product
        </button>
      </header>

      <section className={styles.productGrid}>
        {products.map((product) => (
          <div
            key={product._id}
            className={`${styles.productCard} ${styles.fadeIn}`}
          >
            <div className={styles.productImageContainer}>
              <img src={product.imgUrl?.[0]} alt={product.name} />
            </div>
            <div className={styles.productDetails}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>
                <strong>₹{product.price}</strong> • Stock:{" "}
                {product.quantityAvailable}
              </p>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.updateBtn}
                  onClick={() => handleUpdate(product._id)}
                >
                  Update
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminProductPage;
