import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import React from "react";
import NavbarComponent from "./components/navbar";
import Cart from "./components/cart";
import Orders from "./components/orders";
import Shop from "./components/shop";

function App() {
  return (
    <React.Fragment>
      <NavbarComponent />
      <Container>
        <div className="content">
          <Routes>
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/" element={<Shop />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default App;
