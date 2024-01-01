import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { AuthProvider } from "../providers/AuthProvider";
import Dashboard from "../pages/DashBoard";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Categories from "../pages/Categories";
import Store from "../pages/Store";
import ProductList from "../pages/ProductList";
import Transfer from "../pages/Transfer";
import Expenses from "../pages/Expenses";
import Invoices from "../pages/Invoices";
import Reports from "../pages/Reports";
import Setup from "../pages/Setup";
import Activities from "../pages/Activities";
import AddProduct from "../pages/AddProduct";
import AddStore from "../pages/AddStore";
import Pos from "../pages/Pos";
import ProductView from "../pages/ProductView";
import Suppliers from "../pages/Suppliers";
import SupplierView from "../pages/SupplierView";
import Billing from "../pages/Billing";
import Customers from "../pages/Customers";
import Accounts from "../pages/Accounts";


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <MainLayout />
            </AuthProvider>
        ),
        children: [
            {
                path: "/setup",
                element: <Setup />,
            },
            {
                path: "/",
                element: (
                    <Dashboard />
                ),
            },

            {
                path: "/store",
                element: (
                    <Store />
                ),
            },
            {
                path: "/add-store",
                element: (
                    <AddStore />
                ),
            },
            {
                path: "/categories",
                element: (
                    <Categories />
                ),
            },
            {
                path: "/product-list",
                element: (
                    <ProductList />
                ),
            },
            {
                path: "/product/:id",
                element: (
                    <ProductView />
                ),
            },
            {
                path: "/add-product",
                element: (
                    <AddProduct />
                ),
            },

            {
                path: "/transfer",
                element: (
                    <Transfer />
                ),
            },
            {
                path: "/expenses",
                element: (
                    <Expenses />
                ),
            },
            {
                path: "/accounts",
                element: (
                    <Accounts />
                ),
            },
            {
                path: "/customers",
                element: (
                    <Customers />
                ),
            },
            {
                path: "/invoices",
                element: (
                    <Invoices />
                ),
            },
            {
                path: "/reports",
                element: (
                    <Reports />
                ),
            },
            {
                path: "/suppliers",
                element: (
                    <Suppliers />
                ),
            },
            {
                path: "/supplier/:id",
                element: (
                    <SupplierView />
                ),
            },
            {
                path: "/billing",
                element: (
                    <Billing />
                ),
            },
            {
                path: "/activities",
                element: (
                    <Activities />
                ),
            },
            {
                path: "/pos",
                element: <Pos />,
            },
            {
                path: "/settings",
                element: (
                    <Settings />
                ),
            },


        ],
    },

    {
        path: "/login",
        element: <Login />,
    },
   

]);

export default router;
