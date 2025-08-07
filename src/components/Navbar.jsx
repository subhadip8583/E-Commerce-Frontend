import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount or route change
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  return (
    <nav
      className={`navbar ${isMenuOpen ? "open" : ""}`}
      style={{
        position: location.pathname !== "/admin" ? "fixed" : "static",
        padding: "15px 30px",
      }}
    >
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>🛍️ FlexiMart</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/" onClick={closeMenu}><i className="fa-solid fa-house"></i></Link>
        </li>
        <li>
          <Link to="/cart" onClick={closeMenu}>
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={() => { handleLogout(); closeMenu(); }} className="logout-btn">
             <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          ) : (
            <Link to="/signin" onClick={closeMenu}>Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
