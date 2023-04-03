import React from "react";
import ProductCard from "../components/ProductCard";
import products from "../constants/testProducts";

export default function ProductList() {
  const productCards = products.map((product) => (
    <ProductCard
      key={product.id}
      id={product.id}
      name={product.name}
      brand={product.brand}
      stock={product.stock}
      img={product.img}
    />
  ));
  return (
    <section className="page-section products">
      <h2 className="page-title">All Products</h2>
      <div className="product-grid">{productCards}</div>
    </section>
  );
}
