import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Orders from "../pages/user/Orders";
import AIDoctor from "../pages/AIDoctor";
import ExpertCare from "../pages/expert/ExpertCare";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/user/Profile";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";

import ProtectedRoute from "../routes/ProtectedRoute";


export const router = createBrowserRouter([

  
  

  // 🟢 USER AREA (public pages)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "/expert-care", element: <ExpertCare />},
      { path:  "/profile", element: <Profile />},

      {
  path: "orders",
  element: (
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  ),

},

      // 🟡 Protected user pages
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },

      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },

      {
        path: "/ai-doctor",
        element: <AIDoctor />
      }
    ],
  },

  // 🟢 AUTH PAGES
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // 🔴 ADMIN AREA (protected + role based)
  {
    path: "/admin",
  element: (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout />
    </ProtectedRoute>
  ),

    children: [
      { index: true, element: <AdminDashboard /> },

      {
        path: "products",
        element: <AdminProducts />,
      },

      {
        path: "orders",
        element: <AdminOrders />,
      },
      
    ],
  },
]);