import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../components/shared/TopBar";
import Navbar from "../components/shared/Navbar";
import { useAuth } from "../providers/AuthProvider";

const MainLayout = () => {

    const { loading } = useAuth();

    const location = useLocation()
    console.log(location.pathname)

    if (loading) {

        return (
            <div className="d-flex justify-content-center align-items-center bg-light min-vh-100 min-vw-100 ">
                <div>
                    <img style={{
                        width: "100px",
                        height: "100px",
                        opacity: "0.5"

                    }} src="../../public/loader.svg" alt="" />
                </div>
            </div>
        );
    }

    return (
        <div>
            {
                location.pathname !== "/pos" &&
                <div className="sticky-top">
                    <TopBar />
                    <Navbar />
                </div>
            }

            <Outlet />
        </div>
    );
};

export default MainLayout;
