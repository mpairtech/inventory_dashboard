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
                      <DataTable
                        className="px-0"
                        columns={columns}
                        // data={data}
                        dense
                        pagination
                        paginationPerPage={6}
                        center
                        customStyles={customStyles}
                      />
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
