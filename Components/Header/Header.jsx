import React, { useRef, useEffect, useContext, useState } from "react";
import { Container, Row } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext";
import "./header.css";

const nav__links = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Tours" },
  { path: "/blogs", display: "Blogs" },
];

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  const { user, role, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current?.classList.add("sticky__header");
      } else {
        headerRef.current?.classList.remove("sticky__header");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className={`navigation ${isMenuOpen ? "show__menu" : ""}`}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side */}
            <div className="nav__right d-flex align-items-center gap-3">
              {user ? (
                <>
                  <div className="user__menu" ref={dropdownRef}>
                    <span
                      className="user__name"
                      onClick={toggleDropdown}
                      style={{ cursor: "pointer", padding: "5px 10px" }}
                    >
                      {user.username
                        ? user.username.charAt(0).toUpperCase() +
                          user.username.slice(1)
                        : user.email?.charAt(0).toUpperCase()}{" "}
                      ▾
                    </span>

                    {role !== "admin" && isDropdownOpen && (
                      <div className="dropdown__menu">
                        <NavLink
                          to="/my-bookings"
                          className="dropdown__item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Bookings
                        </NavLink>
                        <NavLink
                          to="/wallet"
                          className="dropdown__item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Wallet
                        </NavLink>
                        
    {/* New Help Chat link */}
    <NavLink
      to="/help-chat"
      className="dropdown__item"
      onClick={() => setIsDropdownOpen(false)}
    >
      Help Chat
    </NavLink>
                      </div>
                    )}
                  </div>

                  {/* Logout Button separate */}
                  <button
                    className="btn btn-dark"
                    style={{ marginLeft: "10px" }}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="auth__buttons d-flex gap-2">
                  <Link className="btn secondary__btn" to="/login">
                    Login
                  </Link>
                  <Link className="btn primary__btn" to="/register">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <span className="mobile__menu" onClick={toggleMenu}>
                {isMenuOpen ? (
                  <i className="ri-close-line"></i>
                ) : (
                  <i className="ri-menu-line"></i>
                )}
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
