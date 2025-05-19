import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/Product/ProductList";
import ProtectedRoute from "./components/ProtectedRoutes";
import CreateProduct from "./pages/Product/CreateProduct";
import ProductDetail from "./pages/Product/ProductDetail";

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
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ProductsPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CreateProduct />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ProductDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
