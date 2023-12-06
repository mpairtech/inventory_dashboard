import React from "react";
import { Link } from "react-router-dom";

const Reports = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 py-2 fw-600 mb-0 ">Reports</p>
            </div>
            <div className="col-lg-8 px-0"></div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border">
                <div className="card-head">
                  <div className="row mt-2"></div>
                </div>
                <div className="card-body min-vh-70 row ">
                  <div className="col-lg-1 text-nowrap">
                    <p className="fs-6 pt-2 mb-2 fw-500 border-bottom border-danger  ">
                      Sale Report
                    </p>
                    <Link className=" d-block " to="/report/daily-sale-report">
                      {" "}
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1 "></i>{" "}
                      <span>Daily </span>{" "}
                    </Link>
                    <Link
                      className=" d-block "
                      to="/report/monthly-sale-report"
                    >
                      {" "}
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>{" "}
                      <span>Monthly </span>{" "}
                    </Link>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-lg-1 text-nowrap">
                    <p className="fs-6 pt-2  mb-2 fw-500 border-bottom border-danger">
                      Stock Report
                    </p>

                    <Link className=" d-block " to="/report/store-base-report">
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Store base</span>
                    </Link>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-lg-2 text-nowrap ">
                    <p className="fs-6 pt-2  mb-2 fw-500 border-bottom border-danger w-75 text-nowrap">
                      Transfer Report
                    </p>
                    <Link
                      className=" d-block "
                      to="/report/daily-transfer-report"
                    >
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Daily</span>
                    </Link>
                    <Link
                      className=" d-block "
                      to="/report/monthly-transfer-report"
                    >
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Monthly</span>
                    </Link>
                  </div>
                  <div className="col-lg-1"></div>
                  <div className="col-lg-1">
                    <p className="fs-6 pt-2  mb-2 fw-500 border-bottom border-danger">
                      Expenses
                    </p>
                    <Link
                      className=" d-block "
                      to="/report/daily-expense-report"
                    >
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Daily</span>
                    </Link>
                    <Link
                      className=" d-block "
                      to="/report/monthly-expense-report"
                    >
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Monthly</span>
                    </Link>
                  </div>

                  <div className="col-lg-1"></div>

                  <div className="col-lg-3"></div>
                  <div className="col-lg-2">
                    <p className="fs-6 pt-2  mb-2 fw-500 border-bottom border-danger w-35 text-nowrap ">
                      Payment
                    </p>
                    <Link className=" d-block " to="/report/daily-pay-report">
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Daily</span>
                    </Link>
                    <Link className=" d-block " to="/report/monthly-pay-report">
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Monthly</span>
                    </Link>
                    {/* <Link className=" d-block " to="/report/bkng-pay-report">
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>Bkash/Nogod</span>
                    </Link> */}
                  </div>

                  <div className="col-lg-1"></div>
                  <div className="col-lg-2">
                    <p className="fs-6 pt-2  mb-2 fw-500 border-bottom border-danger w-75 text-nowrap">
                      Discount Report
                    </p>
                    <Link className=" d-block " to="/report/discount-report">
                      <i class="text-primary fa-solid fa-circle-dot fa-2xs me-1"></i>
                      <span>View report</span>
                    </Link>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
