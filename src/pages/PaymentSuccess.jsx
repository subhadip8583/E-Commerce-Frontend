import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Badge,
  Card,
} from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

import apiCaller from "../utils/apiCaller";
import "../styles/PaymentSuccess.CSS"; // 🔹 Custom CSS (you'll add this below)

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { id } = useParams();

  const apiCallRef = useRef();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  const completePayment = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
const backend = import.meta.env.VITE_BACKEND_URL;
      const response = await apiCaller(
        `${backend}/payment/success?cartid=${id}`,
        `${backend}/user/refreshJWT`,
        accessToken,
        refreshToken,
        "GET",
        {},
        {}
      );

      if (response.success) {
        toast.success("Payment successful!");
        setCartItems(response.data.cart.items);
        setMessage("Thank you for your purchase!");
      } else {
        toast.error("Payment failed. Please try again.");
        setMessage("Payment Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during payment.");
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!apiCallRef.current) {
      apiCallRef.current = true;
      completePayment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-5 min-vh-100 fade-in" style={{ marginTop: "2rem" }}>
      <div className="text-center mb-5">
        <FaCheckCircle size={60} className="text-success mb-3" />
        <h2 className="fw-bold">{message}</h2>
        <p className="text-muted">
          Your order has been successfully placed.
        </p>
      </div>

      {cartItems.length > 0 ? (
        <Row className="justify-content-center">
          {cartItems.map(({ item, quantity }, index) => (
            <Col key={item._id} xs={12} className="mb-4">
              <Card
                className={`shadow-sm border-0 rounded-4 d-flex flex-row align-items-center p-2 card-hover fade-in-up`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <Card.Img
                  src={item.imgUrl?.[0]}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                  }}
                />
                <Card.Body className="d-flex justify-content-between align-items-center w-100 ms-4">
                  {/* Name - left */}
                  <div className="fw-bold text-dark fs-5">{item.name}</div>

                  {/* Price - center */}
                  <div className="text-muted text-center fw-semibold">
                    ₹{item.price}
                  </div>

                  {/* Quantity - right */}
                  <div>
                    <Badge bg="info" className="fw-medium">
                      Qty: {quantity}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-muted">No items found in this order.</p>
      )}

      <div className="d-flex justify-content-center mt-5">
        <Button
          variant="skyblue"
          size="lg"
          className="custom-btn px-4 py-2 rounded-3"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}
