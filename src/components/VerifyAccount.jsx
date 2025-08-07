import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/verify.css";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60); // 1 minutes
  const [resending, setResending] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = async (e) => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing.");
      return;
    }
    try {
      const res = await fetch(`${backend}/user/verifyAccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account verified successfully!");
        navigate("/signin");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleResend = async () => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    setResending(true);
    try {
      const res = await fetch(`${backend}/user/generateOtpForVerification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP resent!");
        setCountdown(60); // reset timer
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Error resending OTP");
    }
    setResending(false);
  };

  return (
    <div className="verify-container">
      <form onSubmit={handleSubmit} className="verify-form">
        <h2>Verify Your Account</h2>
        <p>OTP sent to <strong>{email}</strong></p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit">Verify</button>

        <p style={{ marginTop: "14px", textAlign: "center", color: "#666", fontSize: "14px" }}>
          OTP expires in: <strong>{formatTime(countdown)}</strong>
        </p>

        <button
          type="button"
          className="resend-btn"
          onClick={handleResend}
          disabled={countdown > 0 || resending}
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyAccount;
