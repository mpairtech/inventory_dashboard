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

const Expenses = () => {
  const columns = [
  
    {
      name: "Expense Head",
      selector: (row) => row?.expense_head,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Expense By",
      selector: (row) => row?.expense_by,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Expense Amount",
      selector: (row) => row?.amount,
      sortable: true,
      minWidth: false,
    },

    {
      name: "Expense Description",
      selector: (row) => row?.des,
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
  const { userInfo } = useAuth();
  const [update, setUpdate] = useState(0);
  const [data, setData] = useState([]);
  const [storeList, setStoreList] = useState([]);
  console.log(storeList)
  const [selectedStore, setSelectedStore] = useState(null);

  const getAllExpenses = () => {
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/expense/getExpensesForOrg`, {
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
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/authority/getAllStoreForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setStoreList(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllExpenses();
    getDropDownStore()
  }, [update, selectedStore]);

  const [store, setStore] = useState(null);
  const [expenseHead, setExpenseHead] = useState(null);
  const [expenseBy, setExpenseBy] = useState(null);
  const [amount, setAmount] = useState(null);
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState(null);

  const addExpense = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    data.append("store_id",  store);
    data.append("user_id",  userInfo?.user_id);
    data.append("expense_by",  expenseBy);
    data.append("expense_head",  expenseHead);
    data.append("amount",  amount);
    data.append("des",  description);
    data.append("date",  date);
    fetch(`${import.meta.env.VITE_SERVER}/expense/addExpense`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res?.expense_id) {
          toast.success("Expense added successfully");
          setUpdate(!update);
        } else {
          toast.error("Failed to Add Expense");
        }
      })
      .catch((err) => {
        toast.error("An error occurred while adding Expense");
      });
  }


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
              <span
                className="btn_primary py-2 cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                data-bs-whatever="@mdo"
              >
                Add Expense
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
                    <form onSubmit={addExpense} className="col-lg-12 ">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="exampleModalLabel"
                        >
                          Add Expense
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

                            <div className="my-1 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Store
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setStore(e.target.value)}
                              >
                                <option selected disabled value="">
                                  Select Store
                                </option>
                                {
                                  storeList?.map((item) => (
                                    <option
                                      key={item.store_id}
                                      value={item.store_id}
                                    >
                                      {item.name}
                                    </option>
                                  ))
                                }
                              </select>
                            </div>
                            <div className="my-1 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Expense Head
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setExpenseHead(e.target.value)}
                              >
                                <option selected disabled value="">
                                  Select Expense Head
                                </option>
                                <option value="1">
                                  1
                                </option>
                                <option value="2">
                                  2
                                </option>
                              </select>
                            </div>

                            <div className="my-1 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Expense By
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setExpenseBy(e.target.value)}
                              />
                            </div>

                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Amount
                              </label>
                              <input
                                type="number"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setAmount(e.target.value)}
                              />
                            </div>
                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Date
                              </label>
                              <input
                                type="date"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setDate(e.target.value)}
                              />
                            </div>

                            <div className="my-1 col-12">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Description
                              </label>
                              <textarea
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setDescription(e.target.value)}
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
              <div className="card border min-vh-66">
                <div className="card-head">
                  <div className="row mt-2">

                  </div>
                  <div className="col-lg-2 pe-4 ps-0 col-12 my-1 mx-3">
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
