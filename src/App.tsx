import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";
import CreateProduct from "./pages/Product/CreateProduct";
import ProductDetail from "./pages/Product/ProductDetail";
import CategoryList from "./pages/Category/CategoryList";
import Products from "./pages/Product/ProductList";
import CreateCategory from "./pages/Category/CreateCategory";
import CategoryDetail from "./pages/Category/CategoryDetail";
import WarehouseList from "./pages/Warehouse/WarehouseList";
import WarehouseDetail from "./pages/Warehouse/WarehouseDetail";
import CreateWarehouse from "./pages/Warehouse/CreateWarehouse";
import CustomerList from "./pages/Customer/CustomerList";

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
                <Products />
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

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CategoryList />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CreateCategory />  
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CategoryDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/warehouses"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <WarehouseList />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/warehouses/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CreateWarehouse />   
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/warehouses/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <WarehouseDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CustomerList />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
      
      </Routes>
    </Router>
  );
}

export default App;
