import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../constants/routes";

export default function Sidebar() {
  return (
    <section className="sidebar">
      <div className="logo-container">
        <img src="" />
        <p>Inventory Dashboard</p>
      </div>
      <div className="h-divider"></div>
      <nav className="sidebar-nav">
        <ul>
          <li className="sidebar-nav-link">
            <Link to={routes.HOME}>Home</Link>
          </li>
          <li className="sidebar-nav-link">
            <Link to={routes.PRODUCTS}>Products</Link>
          </li>
          <li className="sidebar-nav-link">
            <Link to={routes.CATEGORIES}>Categories</Link>
          </li>
          <li className="sidebar-nav-link">
            <Link to={routes.BRANDS}>Brands</Link>
          </li>
          <li className="sidebar-nav-link">
            <Link to={routes.LOCATIONS}>Locations</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
