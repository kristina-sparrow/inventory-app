import React from "react";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  return (
    <section className="page-section product-detail">
      <h2 className="page-title">Product Detail</h2>
      <p>Product ID: {id}</p>
    </section>
  );
}
