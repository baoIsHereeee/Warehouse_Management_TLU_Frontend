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
import CreateCustomer from "./pages/Customer/CreateCustomer";
import CustomerDetail from "./pages/Customer/CustomerDetail";
import SupplierList from "./pages/Supplier/SupplierList";
import CreateSupplier from "./pages/Supplier/CreateSupplier";
import SupplierDetail from "./pages/Supplier/SupplierDetail";
import ExportList from "./pages/Export/ExportList";
import CreateExport from "./pages/Export/CreateExport";
import ExportDetail from "./pages/Export/ExportDetail";
import ImportList from "./pages/Import/ImportList";
import CreateImport from "./pages/Import/CreateImport";
import ImportDetail from "./pages/Import/ImportDetail";
import UserList from "./pages/User/UserList";
import CreateUser from "./pages/User/CreateUser";
import UserDetail from "./pages/User/UserDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import RoleDetail from "./pages/Dashboard/RoleDetail";
import Report from "./pages/Report/Report";
import SignUp from "./pages/Login/SignUp";
import TenantPage from "./pages/Login/Tenant";

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
        <Route path="/" element={<Navigate to="/warehouse-management" replace />} />

        <Route path="/log-in" element={<LoginPage />} />

        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/warehouse-management" element={<TenantPage />} />

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

        <Route
          path="/customers/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CreateCustomer />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CustomerDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <SupplierList />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>  
                <CreateSupplier />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <SupplierDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/exports"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ExportList />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/exports/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CreateExport />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/exports/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ExportDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/imports"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ImportList />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/imports/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CreateImport />  
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/imports/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ImportDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <UserList />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CreateUser />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route  
          path="/users/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <UserDetail />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <Dashboard />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/roles/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <RoleDetail />  
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <Report />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
