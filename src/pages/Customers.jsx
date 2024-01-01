import React, { useContext, useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

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

const Customers = () => {
  const columns = [
    {
      name: "Name",
      selector: (row) => row?.name,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Contact No",
      selector: (row) => row?.number,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Address",
      selector: (row) => row?.address,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          <button
            className="border-0 "
            data-bs-toggle="modal"
            data-bs-target={`#exampleModalDelete${row.c_id}`}
          >
            <i className="fa-solid fa-trash fa-lg fa-icon red"></i>
          </button>
          <div
            className="modal fade "
            id={`exampleModalDelete${row.c_id}`}
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
                    onClick={() => handleDelete(row.c_id)}
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
  const [update, setUpdate] = useState(0);
  const [data, setData] = useState([]);

  const getAllCustomers = () => {
    const data = new FormData();
    data.append("org_id", userInfo.organizationData?.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/customer/getSearchCustomers`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setData(res);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (c_id) => {
    const data = new FormData();
    data.append("c_id", c_id);
    fetch(`${import.meta.env.VITE_SERVER}/c_id`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Customer Deleted Successfully");
        setUpdate(update + 1);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllCustomers();
  }, [update]);


  return (
    <div className="container-fluid  ">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 pt-2 fw-600 mb-0">Customer List</p>
              <p className="font-12 mb-2">See All Added Customers</p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border min-vh-66">
                <div className="card-head">
                </div>
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

export default Customers;
