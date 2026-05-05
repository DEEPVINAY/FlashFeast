import React, { useState } from "react";
import {
  ChevronRight,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  User,
  UserPlus,
  X
} from "lucide-react";
import appIcon from "./assets/app-icon.svg";
import "./Navbar.css";

const navigationLinks = [
  { label: "Restaurants", href: "#restaurants" },
  { label: "Menu", href: "#menu" },
  { label: "Live Tracking", href: "#tracking" }
];

export default function Navbar({
  cartCount = 0,
  user = null,
  onLogin,
  onSignup,
  onLogout
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogin = () => {
    closeMobileMenu();
    onLogin?.();
  };

  const handleSignup = () => {
    closeMobileMenu();
    onSignup?.();
  };

  const handleLogout = () => {
    closeMobileMenu();
    onLogout?.();
  };

  const handleNavigate = () => {
    closeMobileMenu();
  };

  return (
    <header className={`ff-navbar${mobileOpen ? " is-open" : ""}`}>
      <div className="ff-navbar__shell">
        <div className="ff-navbar__brandWrap">
          <a className="ff-navbar__brand" href="#top" onClick={handleNavigate} aria-label="FlashFeast home">
            <span className="ff-navbar__brandMark">
              <img src={appIcon} alt="FlashFeast" />
            </span>
            <span className="ff-navbar__brandText">
              <strong>FlashFeast</strong>
              <small>Fresh, fast, focused</small>
            </span>
          </a>
        </div>

        <div className="ff-navbar__linksWrap">
          <nav className="ff-navbar__links" aria-label="Primary navigation">
            {navigationLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={handleNavigate}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="ff-navbar__actionsWrap">
          <div className="ff-navbar__desktopActions">
            {user ? (
              <div className="ff-navbar__accountPill">
                <span>
                  <User size={16} />
                  {user.name}
                </span>
                <button type="button" onClick={handleLogout} aria-label="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="ff-navbar__button ff-navbar__button--ghost"
                  onClick={handleLogin}
                >
                  <LogIn size={16} />
                  Login
                </button>
                <button
                  type="button"
                  className="ff-navbar__button ff-navbar__button--primary"
                  onClick={handleSignup}
                >
                  <UserPlus size={16} />
                  Sign up
                </button>
              </>
            )}

            <a className="ff-navbar__button ff-navbar__button--cart" href="#checkout" onClick={handleNavigate}>
              <ShoppingBag size={16} />
              Cart
              <span className="ff-navbar__count">{cartCount}</span>
            </a>
          </div>

          <div className="ff-navbar__mobileActions">
            <a className="ff-navbar__button ff-navbar__button--cart ff-navbar__button--compact" href="#checkout" onClick={handleNavigate}>
              <ShoppingBag size={16} />
              <span className="ff-navbar__count">{cartCount}</span>
            </a>
            <button
              className="ff-navbar__menuButton"
              type="button"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="ff-navbar-menu"
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="ff-navbar__mobilePanel" id="ff-navbar-menu" aria-hidden={!mobileOpen}>
        <nav className="ff-navbar__mobileLinks" aria-label="Mobile navigation">
          {navigationLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={handleNavigate}>
              <span>{link.label}</span>
              <ChevronRight size={16} />
            </a>
          ))}
        </nav>

        <div className="ff-navbar__mobileActionsList">
          {user ? (
            <div className="ff-navbar__accountPill ff-navbar__accountPill--stacked">
              <span>
                <User size={16} />
                {user.name}
              </span>
              <button type="button" onClick={handleLogout} aria-label="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="ff-navbar__button ff-navbar__button--ghost"
                onClick={handleLogin}
              >
                <LogIn size={16} />
                Login
              </button>
              <button
                type="button"
                className="ff-navbar__button ff-navbar__button--primary"
                onClick={handleSignup}
              >
                <UserPlus size={16} />
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
