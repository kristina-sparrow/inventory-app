import React from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  img: string;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  brand,
  img,
  stock,
}: ProductCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${id}`);
  };

  return (
    <article className="product-card" onClick={handleClick}>
      <img className="card__img" src={img} alt={name}></img>
      <div className="card__info">
        <h4 className="card__name">{name}</h4>
        <h5 className="card__brand">{brand}</h5>
        <h5 className="card__stock">
          In Stock: <span className="card__stock-num">{stock}</span>
        </h5>
      </div>
    </article>
  );
}
