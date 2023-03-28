import React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "../constants/routes";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Brands from "../pages/Brands";
import Locations from "../pages/Locations";

export default function Main() {
  return (
    <main className="main">
      <Routes>
        <Route path={routes.HOME} element={<Home />} />
        <Route path={routes.PRODUCTS} element={<Products />} />
        <Route path={routes.CATEGORIES} element={<Categories />} />
        <Route path={routes.BRANDS} element={<Brands />} />
        <Route path={routes.LOCATIONS} element={<Locations />} />
      </Routes>
    </main>
  );
}
