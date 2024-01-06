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
      name: "Transaction ID",
      selector: (row) => row?.supplier_transaction_id,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Supplier ID",
      selector: (row) => row.supplier_id,
      sortable: true,
      minWidth: false,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: " Date",
      selector: (row) => formatDate(row.date),
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
  const [accountsData, setAccountsData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState("report");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
  
  const [filterFromDate, setFilterFromDate] = useState(startOfMonth);
  const [filterToDate, setFilterToDate] = useState(endOfMonth);


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

  const getAllAccounts = () => {
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/account/getAccountsForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setAccountsData(res);
      })
      .catch((err) => console.log(err));
  };



  useEffect(() => {
    getSupplierData();
    getAllAccounts();
  }, [update]);

  const [date, setDate] = useState("");
  const [supplierBill, setSupplierBill] = useState(null);
  console.log(supplierBill)
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(null);
  console.log(account)

  const sendTransaction = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    data.append("user_id", userInfo?.user_id);
    data.append("supplier_id", supplier_id);
    data.append("supplier_bill_id", supplierBill.supplier_bill_id);
    data.append("account_id", account.account_id);
    data.append("amount", amount);
    data.append("date", date);
    fetch(`${import.meta.env.VITE_SERVER}/supplier/createSupplierTransaction`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res?.supplier_transaction_id) {
          setUpdate(!update);
          toast.success("Transaction successful");
          // setUpdate(!update);
        } else {
          toast.error("Transaction failed");
        }
      })
      .catch((err) => {
        toast.error("An error occurred while transaction");
      });
  }


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
                        <>
                          <div className="mx-3 mt-3 d-flex align-items-center w-35 gap-1 ">
                            <input
                              type="date"
                              className="form-control font-13 shadow-none bg-white"
                              onChange={(e) => setFilterFromDate(new Date(e.target.value).toISOString())}
                              value={new Date(filterFromDate).toISOString().slice(0, 10)}
                            />
                            -
                            <input
                              type="date"
                              className="form-control font-13 shadow-none bg-white"
                              onChange={(e) => setFilterToDate(new Date(e.target.value).toISOString())}
                              value={new Date(filterToDate).toISOString().slice(0, 10)}
                            />
                          </div>
                          <div
                            id="printarea"
                            className="mx-3 mt-3 border shadow-sm bg-white py-4 "
                          >
                            <p className="font-18 mb-0 text-center">Supplier Report</p>
                            {/* <p className="font-16 mb-0 text-center">ORG NAME</p> */}
                            {/* <p className="font-14 text-center mb-0">Supplier List</p> */}
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
                                    Date
                                  </th>

                                  <th
                                    scope="col"
                                    className="border-0 font-13 text-muted font-weight-600"
                                    width="30%"
                                  >
                                    Particular
                                  </th>
                                  <th
                                    scope="col"
                                    className="border-0 font-13 text-muted font-weight-600"
                                    width="20%"
                                  >
                                    Payable
                                  </th>
                                  <th
                                    scope="col"
                                    className="border-0 font-13 text-muted font-weight-600"
                                    width="10%"
                                  >
                                    Paid
                                  </th>

                                </tr>
                              </thead>
                              <tbody className="border-0">

                                <tr className="border-bottom">

                                  <td
                                    scope="col"
                                    className="border-0 font-12 ps-4"
                                  >
                                    {formatDate(supplierData?.createdAt)}
                                  </td>
                                  <td
                                    scope="col"
                                    className="border-0 font-12 font-weight-600"
                                  >
                                    <span
                                      className="d-inline-block text-truncate"
                                      style={{ maxWidth: "250px" }}
                                    >
                                      Opening Balance
                                    </span>
                                  </td>
                                  <td
                                    scope="col"
                                    className="border-0 font-12 font-weight-600"
                                  >
                                    <span
                                      className="d-inline-block text-truncate"
                                      style={{ maxWidth: "250px" }}
                                    >
                                      {supplierData?.op_balance}
                                    </span>
                                  </td>
                                  <td
                                    scope="col"
                                    className="border-0 font-12 font-weight-600"
                                  >
                                    <span
                                      className="d-inline-block text-truncate"
                                      style={{ maxWidth: "250px" }}
                                    >
                                      {/* {supplierData?.supplier_transaction?.reduce((a, b) => a + +b.amount, 0)} */} 0
                                    </span>
                                  </td>
                                </tr>
                                {/* map here */}
                                {
                                  supplierData?.supplier_bill
                                    ?.filter(transaction => new Date(transaction.date) >= new Date(filterFromDate) && new Date(transaction.date) <= new Date(filterToDate))
                                    ?.map((bill) => (
                                      <>
                                        <tr className="border-bottom">

                                          <td
                                            scope="col"
                                            className="border-0 font-12 ps-4"
                                          >
                                            {formatDate(bill.date)}
                                          </td>
                                          <td
                                            scope="col"
                                            className="border-0 font-12 font-weight-600"
                                          >
                                            <span
                                              className="d-inline-block text-truncate"
                                              style={{ maxWidth: "250px" }}
                                            >
                                              Bill-{bill.bill_no}
                                            </span>
                                          </td>
                                          <td
                                            scope="col"
                                            className="border-0 font-12 font-weight-600"
                                          >
                                            <span
                                              className="d-inline-block text-truncate"
                                              style={{ maxWidth: "250px" }}
                                            >
                                              {bill.bill_amount}
                                            </span>
                                          </td>
                                          <td
                                            scope="col"
                                            className="border-0 font-12 font-weight-600"
                                          >
                                            <span
                                              className="d-inline-block text-truncate"
                                              style={{ maxWidth: "250px" }}
                                            >
                                              {/* (paid_amount from transaction) */}
                                              0
                                            </span>
                                          </td>
                                        </tr>

                                        {supplierData?.supplier_transaction
                                          ?.filter((transaction) => transaction.supplier_bill_id === bill.supplier_bill_id)?.map((transaction) => (
                                            <tr className="border-bottom">

                                              <td
                                                scope="col"
                                                className="border-0 font-12 ps-4"
                                              >
                                                {formatDate(transaction.date)}
                                              </td>
                                              <td
                                                scope="col"
                                                className="border-0 font-12 font-weight-600"
                                              >
                                                <span
                                                  className="d-inline-block text-truncate"
                                                >
                                                  Payment-{transaction.supplier_transaction_id}, ({transaction?.account?.name}), Type: {transaction?.account?.accountType}
                                                </span>
                                              </td>
                                              <td
                                                scope="col"
                                                className="border-0 font-12 font-weight-600"
                                              >
                                                <span
                                                  className="d-inline-block text-truncate"
                                                  style={{ maxWidth: "250px" }}
                                                >
                                                  0
                                                </span>
                                              </td>
                                              <td
                                                scope="col"
                                                className="border-0 font-12 font-weight-600"
                                              >
                                                <span
                                                  className="d-inline-block text-truncate"
                                                  style={{ maxWidth: "250px" }}
                                                >
                                                  {/* (paid_amount from transaction) */}
                                                  {transaction.amount}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}


                                      </>
                                    ))
                                }


                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {activeTab === "transaction" && (
                        <div className="mt-3 mx-3">
                          <div className="row">
                            <form onSubmit={sendTransaction} className="col-lg-12 ">
                              <div className="d-flex justify-content-between align-items-center ">
                                <p className="fw-500">
                                  Add New Transaction
                                </p>
                                {
                                  supplierData && <p><span className="fw-500">Due Amount: </span><span className="">
                                    {
                                      +supplierData?.op_balance - +supplierData?.supplier_transaction?.reduce((a, b) => a + +b.amount, 0)
                                    } BDT
                                  </span></p>
                                }

                              </div>
                              <div className="row">
                                <div className="col-lg-6 ">
                                  <div className="">
                                    <label
                                      htmlFor="recipient-name"
                                      className="col-form-label text-muted "
                                    >
                                      Bill
                                    </label>
                                    <select
                                      className="form-control font-13 shadow-none"
                                      onChange={(e) => setSupplierBill(JSON.parse(e.target.value))}
                                    >
                                      <option selected disabled value="">
                                        Select Bill
                                      </option>
                                      {
                                        supplierData?.supplier_bill?.map((bill) => (
                                          <option value={JSON.stringify(bill)}>{bill.bill_no}</option>
                                        ))
                                      }
                                    </select>
                                  </div>



                                  <div className="">
                                    <label
                                      htmlFor="message-text"
                                      className="col-form-label text-muted "
                                    >
                                      Paid Amount
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control font-13 shadow-none bg-white"
                                      onChange={(e) => setAmount(e.target.value)}
                                    />
                                  </div>

                                  <div className="">
                                    <label
                                      htmlFor="recipient-name"
                                      className="col-form-label text-muted "
                                    >
                                      Account
                                    </label>
                                    <select
                                      className="form-control font-13 shadow-none"
                                      onChange={(e) => setAccount(JSON.parse(e.target.value))}
                                    >
                                      <option selected disabled value="">
                                        Select Account
                                      </option>
                                      {
                                        accountsData?.map((account) => (
                                          <option value={JSON.stringify(account)}>{account.name}</option>
                                        ))
                                      }
                                    </select>
                                  </div>

                                  <div className="">
                                    <label
                                      htmlFor="recipient-name"
                                      className="col-form-label text-muted "
                                    >
                                      Payment Date
                                    </label>
                                    <input
                                      type="date"
                                      className="form-control font-13 shadow-none bg-white"
                                      onChange={(e) => setDate(e.target.value)}
                                    />
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="submit"
                                      className="btn_primary mt-3"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                                {
                                  supplierBill && (
                                    <div className="col-6 font-14">
                                      <p><strong>Bill Number:</strong> {supplierBill?.bill_no}</p>
                                      <p><strong>Bill Amount:</strong> {supplierBill?.bill_amount}</p>
                                      <p><strong>Date:</strong> {new Date(supplierBill?.date).toLocaleString()}</p>
                                      <p><strong>Items:</strong></p>
                                      <ul>
                                        {supplierBill?.items?.map((item, index) => (
                                          <li key={index}>
                                            <p><strong>{index + 1})</strong> {item}</p>
                                            <ul>

                                            </ul>
                                          </li>
                                        ))}
                                      </ul>
                                      <p><strong>Transaction History:</strong></p>
                                      {
                                        supplierBill && <p><span className="fw-500">Due Amount: </span><span className="">
                                          {
                                            +supplierBill?.bill_amount - +supplierData?.supplier_transaction?.reduce((a, b) => a + +b.amount, 0)
                                          } BDT
                                        </span></p>
                                      }
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Amount</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {supplierData?.supplier_transaction?.map((item, index) => (
                                            <tr key={index}>
                                              <td>{formatDate(item.date)}</td>
                                              <td>{item.amount} BDT</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>

                                    </div>
                                  )
                                }
                              </div>

                            </form>
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
