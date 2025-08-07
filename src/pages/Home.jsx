import { useEffect, useState } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiCaller from "../utils/apiCaller";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate(); // ⚠️ Make sure you're inside a React component
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await fetch(`${backend}/item/getItemDetails`);
      const data = await response.json();

      if (data.success && Array.isArray(data.items)) {
        const formatted = data.items.map((item, index) => ({
          id: item._id || index,
          name: item.name,
          price: `₹${item.price}`,
          image: item.imgUrl?.[0] || "", // Get first image from imgUrl array
        }));
        setProducts(formatted);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
const handleAddToCart = async (productId) => {
  const accesstoken = localStorage.getItem("accessToken");
  const refreshtoken = localStorage.getItem("refreshToken");

  if (!accesstoken || !refreshtoken) {
    toast.error("Please login to add item");
    navigate("/signin");
    return;
  }
const backend = import.meta.env.VITE_BACKEND_URL;
  const result = await apiCaller(
    `${backend}/item/add`,
    `${backend}/user/refreshJWT`,
    accesstoken,
    refreshtoken,
    "POST",
    {},
    { itemId: productId, quantity: 1 }
  );

  if (result.success) {
    toast.success("Item added to cart!");
  } else {
    toast.error(result.err || "Failed to add item");
    if (result.err.includes("Session expired")) {
      navigate("/signin");
    }
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <section className="products-section">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "200px",
                  width: "auto",
                }}
              ></div>
              <h3 className="product-name">{product.name}</h3>
              <p>{product.price}</p>
              <button onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </button>
              <Link to={`/product/${product.id}`}>
                <button>View More</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
