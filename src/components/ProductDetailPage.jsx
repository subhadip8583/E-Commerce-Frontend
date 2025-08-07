import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Carousel, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import apiCaller from "../utils/apiCaller";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const handleAddToCart = async (productId, redirectToCart = false) => {
    const accesstoken = localStorage.getItem("accessToken");
    const refreshtoken = localStorage.getItem("refreshToken");

    if (!accesstoken || !refreshtoken) {
      toast.error("Please login to add item");
      navigate("/signin");
      return;
    }

    const backend = import.meta.env.VITE_BACKEND_URL;

    try {
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
        if (redirectToCart) {
          navigate("/cart");
        }
      } else {
        toast.error(result.err || "Failed to add item");
        if (result.err?.includes("Session expired")) {
          navigate("/signin");
        }
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const backend = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${backend}/item/getItemDetails`);
        const data = await response.json();

        if (data.success && data.items.length > 0) {
          const foundProduct = data.items.find((obj) => obj["_id"] === id);
          setProduct(foundProduct);
        } else {
          console.error("No product data found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center product-details-container"
    >
      <Row className="w-100 flex-column flex-md-row justify-content-center align-items-center">
        {/* Left - Image Carousel */}
        <Col md={7} className="mb-4 mb-md-0 d-flex justify-content-center">
          <div style={{ width: "100%", maxWidth: "650px" }}>
            <Carousel data-bs-theme="dark">
              {product.imgUrl.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    src={img}
                    alt={`Slide ${idx + 1}`}
                    className="d-block w-100 rounded"
                    style={{ height: "445px", objectFit: "cover" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </Col>

        {/* Right - Product Info */}
        <Col md={5} className="d-flex justify-content-center">
          <Card
            className="shadow p-4 rounded-4 w-100"
            style={{ maxWidth: "500px", background: "#f8f9fa" }}
          >
            <h2 className="mb-3 fw-bold">{product.name}</h2>
            <p>
              <strong>Item Number:</strong> {product.itemNumber}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Price:</strong> ₹{product.price}
            </p>
            <p>
              <strong>Available Quantity:</strong> {product.quantityAvailable}
            </p>

            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-dark px-4 py-2 fw-semibold rounded-3"
                onClick={() => handleAddToCart(product._id)}
              >
                Add to Cart
              </button>

              <button
                className="btn btn-outline-primary px-4 py-2 fw-semibold rounded-3"
                onClick={() => handleAddToCart(product._id, true)}
              >
                Buy Now
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
