import React from "react";
import { FaBell } from "react-icons/fa";

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">Inventory Dashboard</h1>
      <div className="header__tools">
        <input type="text" id="search-bar" placeholder=" " />
        <div className="divider"></div>
        <div className="alerts">
          <FaBell />
        </div>
        <div className="divider"></div>
        <div className="header__user">
          <div className="username">Kristina Sparrow</div>
          <img className="avatar" src="../../assets/avatar.jpg" />
        </div>
      </div>
    </header>
  );
}
