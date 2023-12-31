import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Barcode from "react-barcode";
import { toast } from "react-hot-toast";
import { formatDate, formatTime } from "../utils/utils";
import { useAuth } from "../providers/AuthProvider";
import DataTable, { createTheme } from "react-data-table-component";
createTheme({
  background: {
    default: "#f9f9e1",
  },
});

const customStyles = {
  rows: {
    style: {},
  },
  headCells: {
    style: {
      backgroundColor: "#f9f9e1",
    },
  },
};

const SupplierView = () => {
  const columns = [
    {

      sortable: true,
      minWidth: false,
      center: true,
      width: "50px",
    },
    {
      name: "Supplier Name",
      selector: (row) => row.supplier_name,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Supplier Type",
      selector: (row) => row.supplier_type,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Contact Person",
      selector: (row) => row.contact_person,
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contact_number,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Out Balance",
      selector: (row) => row.op_balance,
      sortable: true,
    },
    {
      name: "Create Date",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
      minWidth: false,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          <Link
            to={`/supplier/${row.supplier_id}`}
            className="border-0"
          >
            <i class="fa-regular fa-circle-right fa-lg"></i>
          </Link>
          <button
            className="border-0 ms-2"
            data-bs-toggle="modal"
            data-bs-target={`#exampleModalDelete${row.expense_id}`}
          >
            <i className="fa-solid fa-trash fa-lg fa-icon  red"></i>
          </button>
          <div
            className="modal fade "
            id={`exampleModalDelete${row.expense_id}`}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title font-14" id="exampleModalLabel">
                    Confirm Delete
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="font-14 ms-2">
                    Are you sure you want to delete?
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn_secondary font-13"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => handleDelete(row.expense_id)}
                    className="btn_danger font-13"
                    data-bs-dismiss="modal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];
  const { userInfo } = useAuth();
  const { id: supplier_id } = useParams();
  const [supplierData, setSupplierData] = useState({});
  console.log(supplierData)

  const [activeTab, setActiveTab] = useState("report");

  const getSupplierData = () => {
    const data = new FormData();
    data.append("supplier_id", supplier_id);
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/supplier/getSupplierById`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setSupplierData(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSupplierData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 ps-4">
          <p className="fs-5 py-2 fw-600 mb-0 text-nowrap ">
            Supplier:  {supplierData?.supplier_name} ({supplierData?.supplier_id})
          </p>
        </div>

        <div className="container">
          <div className="min-vh-66 row ">
            <div className="col-lg-12 ">

              <div className="row bg-white ">
                <div class="col-lg-6 mb-5">
                  <div className="card border min-vh-70">
                    <div className="card-body px-0 pb-1">
                      <p class="text-secondary fw-bold  border-bottom pb-2 ms-3">
                        Basic Info
                      </p>
                      <table className="table ">
                        <tbody>

                          <tr className="">
                            <td>
                              <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                Supplier Name
                              </p>
                            </td>

                            <td>
                              <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                {supplierData?.supplier_name}
                              </p>
                            </td>
                          </tr>

                          <tr className="">
                            <td>
                              <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                Supplier Type
                              </p>
                            </td>
                            <td>
                              <div>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                  {supplierData?.supplier_type}
                                </p>
                              </div>
                            </td>
                          </tr>
                          <tr className="">
                            <td>
                              <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                Contact Person
                              </p>
                            </td>
                            <td>
                              <div>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                  {supplierData?.contact_person}
                                </p>
                              </div>
                            </td>
                          </tr>

                          <tr className="">
                            <td>
                              <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                Contact Number
                              </p>
                            </td>
                            <td>
                              <div>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">

                                  {supplierData?.contact_number}
                                </p>
                              </div>
                            </td>
                          </tr>
                          <tr className="">
                            <td>
                              <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                Location
                              </p>
                            </td>
                            <td>
                              <div>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                  {supplierData?.location}
                                </p>
                              </div>
                            </td>
                          </tr>
                          <tr className="">
                            <td>
                              <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                Opening Balance
                              </p>
                            </td>
                            <td>
                              <div>
                                <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                  {supplierData?.op_balance} BDT
                                </p>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <p className="mb-0 ms-2 align-middle py-2 font-12 fw-600 text-muted">
                                Added Date
                              </p>
                            </td>
                            <td>
                              <p className="mb-0 align-middle py-2 text-muted fw-600 font-12">
                                {formatDate(supplierData?.createdAt)}
                              </p>
                            </td>
                          </tr>
                          <tr></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card border min-vh-70">
                    <div className="card-body px-0 pb-1">
                      <div className="d-flex gap-2 mx-3 ">
                        <button
                          onClick={() => setActiveTab("report")}
                          className={`w-100 ${activeTab === "report" ? "btn_active3" : "btn_inactive3"}`}>
                          Report
                        </button>
                        <button
                          onClick={() => setActiveTab("transaction")}
                          className={`w-100 ${activeTab === "transaction" ? "btn_active3" : "btn_inactive3"}`}>
                          Transaction
                        </button>
                      </div>

                      {activeTab === "report" && (
                        <div
                          id="printarea"
                          className="mx-3 mt-3 border shadow-sm bg-white py-4 "
                        >
                          <p className="font-18 mb-0 text-center">Inventory Report</p>
                          <p className="font-16 mb-0 text-center">ORG NAME</p>
                          <p className="font-14 text-center mb-0">Supplier List</p>
                          <p className="font-12 text-center my-1">
                            Date: {new Date().toLocaleDateString()}
                          </p>
                          <p className="font-12 text-center my-1">NOTE: All amounts are shown in BDT.</p>
                          <table className="table align-middle mt-2">
                            <thead>
                              <tr className="thead-color border">
                                <th
                                  scope="col"
                                  className="border-0 font-13 text-muted font-weight-600 ps-4"
                                  width="10%"
                                >
                                </th>
                                <th
                                  scope="col"
                                  className="border-0 font-13 text-muted font-weight-600 ps-4"
                                  width="60%"
                                >
                                  Name
                                </th>

                                <th
                                  scope="col"
                                  className="border-0 font-13 text-muted font-weight-600"
                                  width="30%"
                                >
                                  Amount
                                </th>

                              </tr>
                            </thead>
                            <tbody className="border-0">

                              <tr className="border-bottom">
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                  Total Sell
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 font-weight-600"
                                >
                                  <span
                                    className="d-inline-block text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    123
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                  Total Amount
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 font-weight-600"
                                >
                                  <span
                                    className="d-inline-block text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    123
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                  Cash Payments
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 font-weight-600"
                                >
                                  <span
                                    className="d-inline-block text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    123
                                  </span>
                                </td>
                              </tr>

                              <tr className="border-bottom">
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4 fw-medium"
                                >
                                  Bank Payments
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                  DBBL
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 font-weight-600"
                                >
                                  <span
                                    className="d-inline-block text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    123
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-bottom">
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 ps-4"
                                >
                                  The City Bank
                                </td>
                                <td
                                  scope="col"
                                  className="border-0 font-12 font-weight-600"
                                >
                                  <span
                                    className="d-inline-block text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    456
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {activeTab === "transaction" && (
                        <div className="mt-3 mx-3">
                          <div className="row">
                            <form onSubmit={{}} className="col-lg-12 ">
                              <div className="">
                                <p
                                  className=""
                                >
                                  Add New Transaction
                                </p>
                              </div>
                                <div
                                  className="col-lg-12 "
                                >
                                  <div className="row">
                                    <div className=" col-lg-6">
                                      <label
                                        htmlFor="recipient-name"
                                        className="col-form-label text-muted "
                                      >
                                        Supplier Name
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control font-13 shadow-none bg-white"
                                        onChange={(e) => setSupplierName(e.target.value)}
                                      />
                                    </div>
                                    <div className="col-lg-6">
                                      <label
                                        htmlFor="recipient-name"
                                        className="col-form-label text-muted "
                                      >
                                        Supplier Type
                                      </label>
                                      <select
                                        className="form-control font-13 shadow-none"
                                        onChange={(e) => setSupplierType(e.target.value)}
                                      >
                                        <option selected disabled value="">
                                          Select Supplier Type
                                        </option>
                                        <option value="test">
                                          test
                                        </option>
                                      </select>
                                    </div>

                                    <div className="col-lg-6">
                                      <label
                                        className="col-form-label text-muted "
                                      >
                                        Contact Person
                                      </label>
                                      <input
                                        className="form-control font-13 shadow-none bg-white"
                                        onChange={(e) => setContactPerson(e.target.value)}
                                      />
                                    </div>

                                    <div className="col-lg-6">
                                      <label
                                        className="col-form-label text-muted"
                                      >
                                        Contact Number
                                      </label>
                                      <input
                                        className="form-control font-13 shadow-none bg-white"
                                        onChange={(e) => setContactNumber(e.target.value)}
                                      />
                                    </div>
                                    <div className=" col-lg-6">
                                      <label
                                        htmlFor="message-text"
                                        className="col-form-label text-muted "
                                      >
                                        Location
                                      </label>
                                      <input
                                        className="form-control font-13 shadow-none bg-white"
                                        onChange={(e) => setLocation(e.target.value)}
                                      />
                                    </div>
                                    <div className="col-lg-6">
                                      <label
                                        htmlFor="message-text"
                                        className="col-form-label text-muted "
                                      >
                                        Opening Balance
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control font-13 shadow-none bg-white"
                                        onChange={(e) => setOpBalance(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              <div className="modal-footer">
                                <button
                                  type="submit"
                                  className="btn_primary mt-3"
                                >
                                  Submit
                                </button>
                              </div>
                            </form>
                          </div>
                          <div>
                            <DataTable
                              noHeader
                              columns={columns}
                              data={[]}
                              customStyles={customStyles}
                              pagination
                              paginationPerPage={5}
                              paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                              className="table table-bordered"
                            />
                          </div>
                        </div>
                      )}


                    </div>
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

export default SupplierView;
