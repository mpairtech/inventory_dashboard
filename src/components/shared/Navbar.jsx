import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const Navbar = () => {
  const { userInfo } = useAuth();
  return (
    <div className="container-fluid pos-primary noprint">
      <div className="row">
        <div className="col-lg-12 px-0">
          <nav
            style={{
              height: "50px",
            }}
            className="navbar border-bottom navbar-expand-lg bg-light p-0"
          >

            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/apps.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Dashboard</p>
              </div>
            </NavLink>


            {
              userInfo.organizationData?.isMulti === "YES" &&
              (
                <NavLink
                  to="/store"
                  className={({ isActive }) =>
                    `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                    }`
                  }
                >
                  <div className="d-flex align-items-center">
                    <img src="/shop.png" className="nav-img-icon me-2" />
                    <p className="mb-0 me-2 ms-1">Store</p>
                  </div>
                </NavLink>
              )
            }


            <NavLink
              to={"/categories"}
              className={({ isActive }) =>
                `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/crown.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Product Category</p>
              </div>
            </NavLink>


            <NavLink
              to={"/product-list"}
              className={({ isActive }) =>
                `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/boxes.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Product list</p>
              </div>
            </NavLink>

            {
              userInfo.organizationData?.isMulti === "YES" &&
              (
                <NavLink
                  to="/transfer"
                  className={({ isActive }) =>
                    `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                    }`
                  }
                >
                  <div className="d-flex align-items-center">
                    <img src="/share.png" className="nav-img-icon me-2" />
                    <p className="mb-0 me-2 ms-1">Transfer</p>
                  </div>
                </NavLink>
              )}

            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `font-16 my-0 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/expense.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Expense</p>
              </div>
            </NavLink>

            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                `font-16 my-0 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/receipt.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Invoice</p>
              </div>
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/chart-histogram.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Report</p>
              </div>
            </NavLink>

            <NavLink
              to="/suppliers"
              className={({ isActive }) =>
                `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/boxes.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Supplier</p>
              </div>
            </NavLink>
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `font-16 ${isActive ? "active_nav px-4" : "inactive_nav px-4"
                }`
              }
            >
              <div className="d-flex align-items-center">
                <img src="/chart-histogram.png" className="nav-img-icon me-2" />
                <p className="mb-0 me-2 ms-1">Activity</p>
              </div>
            </NavLink>

          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
