import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/Product/ProductList";

const LayoutWithNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/log-in" replace />} />

        <Route path="/log-in" element={<LoginPage />} />

        <Route
          path="/products"
          element={
            <LayoutWithNavbar>
              <ProductsPage />
            </LayoutWithNavbar>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
