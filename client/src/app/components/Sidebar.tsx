import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../constants/routes";

export default function Sidebar() {
  return (
    <section className="sidebar">
      <img className="sidebar__logo" src="../../assets/logo.png" />
      <h1 className="sidebar__title">Modular Store</h1>
      <div className="h-divider"></div>
      <nav className="sidebar__nav">
        <ul>
          <li className="sidebar__nav-link">
            <Link to={routes.HOME}>Home</Link>
          </li>
          <li className="sidebar__nav-link">
            <Link to={routes.PRODUCT_LIST}>All Products</Link>
          </li>
          <li className="sidebar__nav-link">
            <Link to={routes.CATEGORIES}>Categories</Link>
          </li>
          <li className="sidebar__nav-link">
            <Link to={routes.BRANDS}>Brands</Link>
          </li>
          <li className="sidebar__nav-link">
            <Link to={routes.LOCATIONS}>Store Locations</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
