import React, { useContext, useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { UserInfoContext, useAuth } from "../providers/AuthProvider";
import { formatDate } from "../utils/utils";

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

const Suppliers = () => {
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
  console.log(userInfo);
  const [update, setUpdate] = useState(0);
  const [data, setData] = useState([]);


  const getAllSuppliers = () => {
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/supplier/getSuppliersForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    const data = new FormData();
    data.append("expense_id", id);
    fetch(`${import.meta.env.VITE_SERVER}/supplier/delete`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Expense Deleted Successfully");
        setUpdate(update + 1);
      })
      .catch((err) => console.log(err));
  };

  const [supplierName, setSupplierName] = useState("");
  const [supplierType, setSupplierType] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [opBalance, setOpBalance] = useState("");

  const addSupplier = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    data.append("supplier_name", supplierName);
    data.append("supplier_type", supplierType);
    data.append("contact_person", contactPerson);
    data.append("contact_number", contactNumber);
    data.append("location", location);
    data.append("op_balance", opBalance);
    fetch(`${import.meta.env.VITE_SERVER}/supplier/addSupplier`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.supplier_id) {
          toast.success("Supplier added successfully");
          setUpdate(!update);
        } else {
          toast.error("Failed to Add Supplier");
        }
      })
      .catch((err) => {
        toast.error("An error occurred while adding the Supplier");
      });
  }

  useEffect(() => {
    getAllSuppliers();
  }, [update]);

  return (
    <div className="container-fluid  ">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 pt-2 fw-600 mb-0">Suppliers List</p>
              <p className="font-12 mb-2">See all listed suppliers</p>
            </div>
            <div className="col-lg-8 px-0"></div>
            <div className="col-lg-2 mt-3 ps-4">
              <span
                className="btn_primary py-2 cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                data-bs-whatever="@mdo"
              >
                Add Supplier
              </span>
              <div
                className="modal fade"
                id="exampleModal2"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <form onSubmit={addSupplier} className="col-lg-12 ">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="exampleModalLabel"
                        >
                          Add New Supplier
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <div
                          className="col-lg-12 "
                        >
                          <div className="row">
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Supplier Name
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setSupplierName(e.target.value)}
                              />
                            </div>
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Supplier Type
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
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

                            <div className="my-3 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Contact Person
                              </label>
                              <input
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setContactPerson(e.target.value)}
                              />
                            </div>

                            <div className="my-3 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Contact Number
                              </label>
                              <input
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setContactNumber(e.target.value)}
                              />
                            </div>
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="message-text"
                                className="col-form-label text-muted fw-500"
                              >
                                Location
                              </label>
                              <input
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setLocation(e.target.value)}
                              />
                            </div>
                            <div className="my-3 col-lg-6">
                              <label
                                htmlFor="message-text"
                                className="col-form-label text-muted fw-500"
                              >
                                Opening Balance
                              </label>
                              <input
                                type="number"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setOpBalance(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn_danger"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          data-bs-dismiss="modal"
                          className="btn_primary"
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border min-vh-70">
                <div className="card-body px-0 pb-1">
                  <DataTable
                    className="px-0"
                    columns={columns}
                    data={data}
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
  );
};

export default Suppliers;
