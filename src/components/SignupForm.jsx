import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signup.css";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
     const backend = import.meta.env.VITE_BACKEND_URL;
    e.preventDefault();

    try {
      // Step 1: Signup API call
      const res = await fetch(`${backend}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful!");

        // Step 2: Trigger OTP generation
        const otpRes = await fetch(`${backend}/user/generateOtpForVerification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        });

        const otpData = await otpRes.json();

        if (otpRes.ok) {
          toast.info("OTP sent to your email. Please verify.");
          // Optional: redirect to verify page (if you have it)
          setTimeout(() => {
           navigate("/verify-account", { state: { email: formData.email } });
          }, 2000);
        } else {
          toast.warning(otpData.message || "Failed to send OTP");
        }
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
