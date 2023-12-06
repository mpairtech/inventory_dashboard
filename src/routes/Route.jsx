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