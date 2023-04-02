import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Sidebar />
      <div className="content">
        <Header />
        <Main />
        <Footer />
      </div>
    </>
  );
}
