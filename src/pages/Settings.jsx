import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import CustomizeCategory from "./settings/CustomizeCategory";
import CustomizeUnit from "./settings/CustomizeUnit";
import CustomizeAttribute from "./settings/CustomizeAttribute";
import CustomizeUser from "./settings/CustomizeUser";
import CustomizeOrg from "./settings/CustomizeOrg";
import CustomizeEmployee from "./settings/CustomizeEmployee";


const Settings = () => {

  const [activeTab, setActiveTab] = useState("Organization");
  const { userInfo } = useAuth();

  console.log(userInfo.user_id);


  return (
    <div className="container-fluid ">
      <div className="row px-0">
        <div className="col-lg-12 px-0">
          <div className="py-2 px-0 bg-white border-0 rounded  ">
            <p className="pb-2 mb-1 text-muted ps-4 fw-700 border-bottom fs-5">
              Settings
            </p>
            <div className="row mx-0">
              <div className="col-lg-2 px-0 custom_border">

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Organization" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Organization")}
                  >
                    Organization
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Store" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Store")}
                  >
                    Store
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "User" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("User")}
                  >
                    User
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>
                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Employee" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Employee")}
                  >
                    Employee
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>
                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Category" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Category")}
                  >
                    Category
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Unit" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Unit")}
                  >
                    Unit
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

                <div className="mt-2 mx-2" >
                  <button
                    className={`w-100  text-start font-13 d-flex justify-content-between align-items-center my-1 fs-6 px-2 ${activeTab === "Attribute" ? "btn_active" : "btn_inactive"}`}
                    onClick={() => setActiveTab("Attribute")}
                  >
                    Attribute
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>

              </div>

              <div className="col-lg-10 px-0">
                {
                  activeTab === "Organization" &&
                  <CustomizeOrg />
                }
                {
                  activeTab === "User" &&
                  <CustomizeUser />
                }
                {
                  activeTab === "Employee" &&
                  <CustomizeEmployee />
                }
                {
                  activeTab === "Category" &&
                  <CustomizeCategory />
                }
                {
                  activeTab === "Unit" &&
                  <CustomizeUnit />
                }
                {
                  activeTab === "Attribute" &&
                  <CustomizeAttribute />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
