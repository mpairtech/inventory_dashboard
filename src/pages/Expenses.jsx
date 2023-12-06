import React, { useContext, useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { UserInfoContext } from "../providers/AuthProvider";

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

const Expenses = () => {
  const columns = [
    {
      name: "Expense ID",
      selector: (row) => row.expense_id,
      sortable: true,
      minWidth: false,
      center: true,
    },
    {
      name: "Create Date",
      selector: (row) => row.cdate,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Expense By",
      selector: (row) => row.expense_by,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Expense Head",
      selector: (row) => row.expense_head,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Expense Description",
      selector: (row) => row.des,
      sortable: true,
    },
    {
      name: "Expense Amount",
      selector: (row) => row.expense_amount,
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          <button
            className="border-0 "
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
  const { userInfo } = useContext(UserInfoContext);
  const [update, setUpdate] = useState(0);
  const [data, setData] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const getAllExpenses = () => {
    const data = new FormData();
    fetch(`${import.meta.env.VITE_SERVER}/admin/getAllExpenses`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (selectedStore) {
          const storeData = res.message.filter((item) => {
            return item.store_id == selectedStore;
          });
          setData(storeData);
        } else {
          setData(res.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    const data = new FormData();
    data.append("expense_id", id);
    fetch(`${import.meta.env.VITE_SERVER}/admin/deleteExpenseById`, {
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

  const getDropDownStore = () => {
    const data = new FormData();
    // data.append("store_id", userInfo.store_id);
    fetch(`${import.meta.env.VITE_SERVER}/admin/getAllStore`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setStoreList(res.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllExpenses();
    getDropDownStore()
  }, [update, selectedStore]);
  return (
    <div className="container-fluid  ">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 pt-2 fw-600 mb-0">Expenses History</p>
              <p className="font-12 mb-2">Expenses List</p>
            </div>
            <div className="col-lg-8 px-0"></div>
            <div className="col-lg-2 mt-3 ps-4">
              <Link to="/add-expense" className="btn_primary py-2 ">
                + Add New Entry
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border min-vh-66">
                <div className="card-head">
                  <div className="row mt-2">

                  </div>
                  <div className="col-lg-2 pe-4 ps-0 col-12 my-3 mx-3">
                    <select
                      className="form-control py-2 font-13 shadow-none"
                      onChange={(e) => setSelectedStore(e.target.value)}
                    >
                      <option selected disabled value="">Select Store</option>
                      {storeList?.map((item) => (
                        <option
                          key={item.store_id}
                          value={item.store_id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
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

export default Expenses;
