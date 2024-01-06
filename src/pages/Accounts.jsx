import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { formatDate } from "../utils/utils";
const Accounts = () => {

  const { userInfo } = useAuth();
  const [update, setUpdate] = useState(0);
  const [storeList, setStoreList] = useState([]);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("account_details");

  const [store, setStore] = useState("");
  const [name, setName] = useState("");
  const [accType, setAccType] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [refNo, setRefNo] = useState("");
  const [balance, setBalance] = useState("");
  const [date, setDate] = useState(new Date().toISOString());

  const [selectedAcc, setSelectedAcc] = useState({});

  console.log(selectedAcc)

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
    getDropDownStore()
  }, [update]);



  const addAccount = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    data.append("user_id", userInfo.user_id);
    data.append("store_id", store);
    data.append("name", name);
    data.append("accountType", accType);
    data.append("holder_name", holderName);
    data.append("account_no", accNo);
    data.append("ref_no", refNo);
    data.append("balance", balance);
    data.append("date", date);

    fetch(`${import.meta.env.VITE_SERVER}/account/addAccount`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res?.account_id) {
          toast.success("Account added successfully");
          setUpdate(!update);
        } else {
          toast.error("Failed to Add Account");
        }
      })
      .catch((err) => {
        toast.error("An error occurred while adding Account");
      });
  }

  const [transferFromAccount, setTransferFromAccount] = useState("");
  const [transferToAccount, setTransferToAccount] = useState("");
  const [transferBalance, setTransferBalance] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString());

  console.log(transferFromAccount, transferToAccount, transferBalance, transferDate)

  const handleTransferAccount = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("org_id", userInfo.organizationData.org_id);
    data.append("user_id", userInfo.user_id);
    data.append("from_account_id", transferFromAccount);
    data.append("to_account_id", transferToAccount);
    data.append("transferBalance", transferBalance);
    data.append("date", transferDate);

    fetch(`${import.meta.env.VITE_SERVER}/account/transferAccount`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res?.message) {
          toast.success("Account transferred successfully");
          setUpdate(!update);
        } else {
          toast.error("Failed to transfer Account");
        }
      })
      .catch((err) => {
        toast.error("An error occurred while transferring Account");
      });
  }

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
        setData(res);
      })
      .catch((err) => console.log(err));
  };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
  
  const [filterFromDate, setFilterFromDate] = useState(startOfMonth);
  const [filterToDate, setFilterToDate] = useState(endOfMonth);

  function groupAndSortTransfers(selectedAcc) {
    // Create an array of all transfers
    const allTransfers = [...selectedAcc?.outgoing_transfers, ...selectedAcc.incoming_transfers];

    // Map each transfer to a transaction object
    const transactions = allTransfers.map(transfer => {
      return {
        date: transfer.date,
        particular: transfer.from_account_id === selectedAcc.account_id
          ? transfer.to_account.name
          : transfer.from_account.name,
        debit: transfer.to_account_id === selectedAcc.account_id ? transfer.transferBalance : 0,
        credit: transfer.from_account_id === selectedAcc.account_id ? transfer.transferBalance : 0,
      };
    });

    // Sort transactions by date in descending order
    transactions.sort((b, a) => new Date(b.date) - new Date(a.date));

    // Calculate balance for each transaction
    let balance = 0;
    transactions.forEach(transaction => {
      balance += transaction.credit - transaction.debit;
      transaction.balance = balance;
    });

    // Filter transactions by date
    const filteredTransactions = transactions.filter(transaction => new Date(transaction.date) >= new Date(filterFromDate) && new Date(transaction.date) <= new Date(filterToDate));

    return filteredTransactions;
  }

  if (selectedAcc?.account_id) {
    var sortedTransactions = groupAndSortTransfers(selectedAcc);
  }
  console.log(sortedTransactions)

  useEffect(() => {
    getAllAccounts();

  }, [update]);



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 py-2 fw-600 mb-0">Accounts</p>
            </div>
            <div className="col-lg-6 px-0"></div>
            <div className="col-lg-2 ps-5 mt-3 mb-3">
              <span
                className="btn_primary py-2 cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                data-bs-whatever="@mdo"
              >
                Add Account
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
                    <form onSubmit={addAccount} className="col-lg-12 ">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="exampleModalLabel"
                        >
                          Add Account
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
                                className="form-control py-2 font-13 shadow-none "
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
                                Name
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>

                            <div className="my-1 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted fw-500"
                              >
                                Set Account Type
                              </label>
                              <select
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setAccType(e.target.value)}
                              >
                                <option selected disabled value=""> Select Account Type</option>
                                <option value="CASH">Cash</option>
                                <option value="BANK">Bank</option>
                                <option value="OTHER">Other</option>
                              </select>
                            </div>

                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500">
                                Holder Name
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setHolderName(e.target.value)}
                              />
                            </div>
                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Account Number
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setAccNo(e.target.value)}
                              />
                            </div>
                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Reference Number
                              </label>
                              <input
                                type="text"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setRefNo(e.target.value)}
                              />
                            </div>
                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Balance
                              </label>
                              <input
                                type="number"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setBalance(e.target.value)}
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
                                onChange={(e) => setDate(new Date(e.target.value).toISOString())}
                                value={new Date(date).toISOString().slice(0, 10)}
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
            <div className="col-lg-2 mt-3 mb-3">
              <span
                className="btn_primary py-2 cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalTransfer"
                data-bs-whatever="@mdo"
              >
                Transfer Account
              </span>
              <div
                className="modal fade"
                id="exampleModalTransfer"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <form onSubmit={handleTransferAccount} className="col-lg-12 ">
                      <div className="modal-header">
                        <h1
                          className="modal-title fs-5"
                          id="exampleModalLabel"
                        >
                          Transfer Account
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
                                className="col-form-label text-muted "
                              >
                                Transfer from
                              </label>
                              <select
                                className="form-control font-13 shadow-none"
                                onChange={(e) => setTransferFromAccount(e.target.value)}
                              >
                                <option selected disabled value="">
                                  Select Account
                                </option>
                                {
                                  data?.map((account) => (
                                    <option key={account.account_id} value={account.account_id}>{account.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                            <div className="my-1 col-lg-6">
                              <label
                                htmlFor="recipient-name"
                                className="col-form-label text-muted "
                              >
                                Transfer To
                              </label>
                              <select
                                className="form-control font-13 shadow-none"
                                onChange={(e) => setTransferToAccount(e.target.value)}
                              >
                                <option selected disabled value="">
                                  Select Account
                                </option>
                                {
                                  data?.map((account) => (
                                    <option key={account.account_id} value={account.account_id}>{account.name}</option>
                                  ))
                                }
                              </select>
                            </div>

                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500"
                              >
                                Balance
                              </label>
                              <input
                                type="number"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setTransferBalance(e.target.value)}
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
                                onChange={(e) => setTransferDate(new Date(e.target.value).toISOString())}
                                value={new Date(transferDate).toISOString().slice(0, 10)}
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
              <div className="card border">
                <div className="card-head">
                  <div className="row mt-2"></div>
                </div>
                <div className="card-body min-vh-70 row">
                  <div className="row">
                    <div className="col-4">
                      <div className="accordion accordion-flush " id="accordionFlushExample">
                        <div className="accordion-item ">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed shadow-none border-0"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseOne"
                              aria-expanded="false"
                              aria-controls="flush-collapseOne"
                            >
                              Cash Accounts
                            </button>
                          </h2>
                          <div
                            id="flush-collapseOne"
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              {
                                data
                                  ?.filter((item) => item?.accountType === "CASH")
                                  ?.map((item) => (
                                    <div
                                      onClick={() =>
                                        setSelectedAcc(item)
                                      }
                                      key={item.account_id} className={`row border rounded-1  p-3 mb-2 cursor-pointer accordion ${selectedAcc === item ? "selected_effect" : ""}`}>
                                      <div className="col-6">
                                        <p className="fw-500 mb-0">{item?.name}</p>
                                        <p className="text-muted mb-0">{item?.account_no}</p>
                                      </div>
                                      <div className="col-6">
                                        <p className="fw-500 mb-0">{item?.balance}</p>
                                        <p className="fw-500 mb-0">{item?.ref_no}</p>
                                      </div>
                                    </div>
                                  ))
                              }
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed  shadow-none border-0"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseTwo"
                              aria-expanded="false"
                              aria-controls="flush-collapseTwo"
                            >
                              Bank Accounts
                            </button>
                          </h2>
                          <div
                            id="flush-collapseTwo"
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              {
                                data
                                  ?.filter((item) => item?.accountType === "BANK")
                                  ?.map((item) => (
                                    <div
                                      onClick={() =>
                                        setSelectedAcc(item)
                                      }
                                      key={item.account_id} className={`row border rounded-1  p-3 mb-2 cursor-pointer accordion ${selectedAcc === item ? "selected_effect" : ""}`}>
                                      <div className="col-6">
                                        <p className="fw-500 mb-0">{item?.name}</p>
                                        <p className="text-muted mb-0">{item?.account_no}</p>
                                      </div>
                                      <div className="col-6">
                                        <p className="fw-500 mb-0">{item?.balance}</p>
                                        <p className="fw-500 mb-0">{item?.ref_no}</p>
                                      </div>
                                    </div>
                                  ))
                              }
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed shadow-none border-0"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseThree"
                              aria-expanded="false"
                              aria-controls="flush-collapseThree"
                            >
                              Other Accounts
                            </button>
                          </h2>
                          <div
                            id="flush-collapseThree"
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionFlushExample"
                          >
                            <div className="accordion-body">
                              {
                                data
                                  ?.filter((item) => item?.accountType === "OTHER")
                                  ?.map((item) => (
                                    <div
                                      onClick={() =>
                                        setSelectedAcc(item)
                                      }
                                      key={item.account_id} className={`row border rounded-1  p-3 mb-2 cursor-pointer accordion ${selectedAcc === item ? "selected_effect" : ""}`}>
                                      <div className="col-6">
                                        <p className="fw-500 mb-0">{item?.name}</p>
                                        <p className="text-muted mb-0">{item?.account_no}</p>
                                      </div>
                                      <div className="col-6">
                                        <p className="fw-500 mb-0">{item?.balance}</p>
                                        <p className="fw-500 mb-0">{item?.ref_no}</p>
                                      </div>
                                    </div>
                                  ))
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="card">


                        <div className="card-header font-16 fw-500">

                          <div className="d-flex gap-3 ">
                            <button
                              onClick={() => setActiveTab("account_details")}
                              className={`w-100 ${activeTab === "account_details" ? "btn_active3" : "btn_inactive3"}`}>
                              Account Details
                            </button>
                            <button
                              onClick={() => setActiveTab("account_history")}
                              className={`w-100 ${activeTab === "account_history" ? "btn_active3" : "btn_inactive3"}`}>
                              Account History
                            </button>
                          </div>
                        </div>

                        {
                          activeTab === "account_details" &&
                          <div className="card-body">
                            <div className="mb-3">
                              <label htmlFor="accountName" className="form-label">
                                Account Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="accountName"
                                value={selectedAcc.name}
                                readOnly
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="accountType" className="form-label">
                                Account Type
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="accountType"
                                value={selectedAcc.accountType}
                                readOnly
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="holderName" className="form-label">
                                Holder Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="holderName"
                                value={selectedAcc.holder_name}
                                readOnly
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="accountNo" className="form-label">
                                Account Number
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="accountNo"
                                value={selectedAcc.account_no}
                                readOnly
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="balance" className="form-label">
                                Balance
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="balance"
                                value={selectedAcc.balance}
                                readOnly
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="status" className="form-label">
                                Status
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="status"
                                value={selectedAcc.status}
                                readOnly
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="createdAt" className="form-label">
                                Created At
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="createdAt"
                                value={new Date().toLocaleString()}
                                readOnly
                              />
                            </div>
                          </div>
                        }

                        {
                          activeTab === "account_history" &&
                          <>
                            <div className="mx-3 mt-3 d-flex align-items-center w-30 gap-1 ">
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

                              <p className="font-18 mb-0 text-center">Account Report</p>
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
                                    </th>
                                    <th
                                      scope="col"
                                      className="border-0 font-13 text-muted font-weight-600 ps-4"
                                      width="20%"
                                    >
                                      Date
                                    </th>

                                    <th
                                      scope="col"
                                      className="border-0 font-13 text-muted font-weight-600"
                                      width="20%"
                                    >
                                      Particular
                                    </th>

                                    <th
                                      scope="col"
                                      className="border-0 font-13 text-muted font-weight-600"
                                      width="20%"
                                    >
                                      Debit
                                    </th>

                                    <th
                                      scope="col"
                                      className="border-0 font-13 text-muted font-weight-600"
                                      width="0%"
                                    >
                                      Credit
                                    </th>
                                    <th
                                      scope="col"
                                      className="border-0 font-13 text-muted font-weight-600"
                                      width="0%"
                                    >
                                      Balance
                                    </th>

                                  </tr>
                                </thead>
                                <tbody className="border-0">

                                  <tr className="border-bottom">
                                    <td scope="col"
                                      className="border-0 font-12 ps-4"
                                    >
                                    </td>
                                    <td
                                      scope="col"
                                      className="border-0 font-12 ps-4"
                                    >
                                      {formatDate(selectedAcc?.date)}
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
                                        {selectedAcc?.balance}
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
                                        {selectedAcc?.balance}
                                      </span>
                                    </td>
                                  </tr>

                                  {/* map here */}

                                  {sortedTransactions?.map((item, index) => (
                                    <>
                                      <tr className="border-bottom">
                                        <td scope="col"
                                          className="border-0 font-12 ps-4"
                                        >
                                        </td>
                                        <td
                                          scope="col"
                                          className="border-0 font-12 ps-4"
                                        >
                                          {formatDate(item.date)}
                                        </td>

                                        <td
                                          scope="col"
                                          className="border-0 font-12 font-weight-600"
                                        >
                                          <span
                                            className="d-inline-block text-truncate"
                                            style={{ maxWidth: "250px" }}
                                          >
                                            {item.particular}
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
                                            {item.debit}
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
                                            {item.credit}
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
                                            {selectedAcc?.balance - item.balance}
                                          </span>
                                        </td>
                                      </tr>
                                    </>
                                  ))
                                  }
                                </tbody>
                              </table>
                            </div>
                          </>
                        }
                      </div>
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

export default Accounts;
