import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import toast from "react-hot-toast";
const Accounts = () => {

  const { userInfo } = useAuth();
  const [update, setUpdate] = useState(0);
  const [storeList, setStoreList] = useState([]);
  const [data, setData] = useState([]);


  const [store, setStore] = useState("");
  const [name, setName] = useState("");
  const [accType, setAccType] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [refNo, setRefNo] = useState("");
  const [balance, setBalance] = useState("");
  const [date, setDate] = useState("");

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

  useEffect(() => {
    getAllAccounts();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 py-2 fw-600 mb-0">Accounts</p>
            </div>
            <div className="col-lg-8 px-0"></div>
            <div className="col-lg-2 mt-3 ps-4 mb-3">
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
                                onChange={(e) => setDate(e.target.value)}
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
                          <p>Bank Account Details</p>
                        </div>
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
