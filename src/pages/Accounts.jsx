import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const Accounts = () => {

  const { userInfo } = useAuth();
  const [update, setUpdate] = useState(0);
  const [storeList, setStoreList] = useState([]);
  console.log(storeList)

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
                                <option value="CASH"> CASH</option>
                              </select>
                            </div>

                            <div className="my-1 col-lg-6">
                              <label
                                className="col-form-label text-muted fw-500">
                                Holder Name
                              </label>
                              <input
                                type="number"
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
                                type="date"
                                className="form-control py-2 font-13 shadow-none bg-white"
                                onChange={(e) => setBalance(e.target.value)}
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

                <>
  <div className="single-accordion">
    <div className="accordion-style-one">
      <div className="accordion" id="accordion">
        <div className="card">
          <div className="card-header" id="headingOne">
            <a
              href="#collapseOne"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="true"
            >
              Accordions title here
            </a>
          </div>
          <div
            id="collapseOne"
            className="collapse show"
            data-bs-parent="#accordion"
          >
            <div className="card-body">
              <p className="text">
                Raw denim you probably haven’t heard of them jean shorts Austin.
                Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                Mustache cliche tempor, williamsburg carles vegan helvetica.
                Reprehenderit butcher retro keffiyeh dreamcatcher synth. <br />
                <br />
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                Aliquip placeat salvia cillum iphone. Seitan aliquip quis
                cardigan american apparel, butcher voluptate nisi qui.
              </p>
            </div>
          </div>
        </div>
        {/* card */}
        <div className="card">
          <div className="card-header" id="headingTwo">
            <a
              className="collapsed"
              href="#collapseTwo"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
            >
              Accordions title here
            </a>
          </div>
          <div
            id="collapseTwo"
            className="collapse"
            data-bs-parent="#accordion"
          >
            <div className="card-body">
              <p className="text">
                Raw denim you probably haven’t heard of them jean shorts Austin.
                Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                Mustache cliche tempor, williamsburg carles vegan helvetica.
                Reprehenderit butcher retro keffiyeh dreamcatcher synth. <br />
                <br />
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                Aliquip placeat salvia cillum iphone. Seitan aliquip quis
                cardigan american apparel, butcher voluptate nisi qui.
              </p>
            </div>
          </div>
        </div>
        {/* card */}
        <div className="card">
          <div className="card-header" id="headingThree">
            <a
              className="collapsed"
              href="#collapseThree"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
            >
              Accordions title here
            </a>
          </div>
          <div
            id="collapseThree"
            className="collapse"
            data-bs-parent="#accordion"
          >
            <div className="card-body">
              <p className="text">
                Raw denim you probably haven’t heard of them jean shorts Austin.
                Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                Mustache cliche tempor, williamsburg carles vegan helvetica.
                Reprehenderit butcher retro keffiyeh dreamcatcher synth. <br />
                <br />
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                Aliquip placeat salvia cillum iphone. Seitan aliquip quis
                cardigan american apparel, butcher voluptate nisi qui.
              </p>
            </div>
          </div>
        </div>
        {/* card */}
        <div className="card">
          <div className="card-header" id="headingFour">
            <a
              className="collapsed"
              href="#collapseFour"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
            >
              Accordions title here
            </a>
          </div>
          <div
            id="collapseFour"
            className="collapse"
            data-bs-parent="#accordion"
          >
            <div className="card-body">
              <p className="text">
                Raw denim you probably haven’t heard of them jean shorts Austin.
                Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                Mustache cliche tempor, williamsburg carles vegan helvetica.
                Reprehenderit butcher retro keffiyeh dreamcatcher synth. <br />
                <br />
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                Aliquip placeat salvia cillum iphone. Seitan aliquip quis
                cardigan american apparel, butcher voluptate nisi qui.
              </p>
            </div>
          </div>
        </div>
        {/* card */}
        <div className="card">
          <div className="card-header" id="headingFive">
            <a
              className="collapsed"
              href="#collapseFive"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
            >
              Accordions title here
            </a>
          </div>
          <div
            id="collapseFive"
            className="collapse"
            data-bs-parent="#accordion"
          >
            <div className="card-body">
              <p className="text">
                Raw denim you probably haven’t heard of them jean shorts Austin.
                Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                Mustache cliche tempor, williamsburg carles vegan helvetica.
                Reprehenderit butcher retro keffiyeh dreamcatcher synth. <br />
                <br />
                Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                Aliquip placeat salvia cillum iphone. Seitan aliquip quis
                cardigan american apparel, butcher voluptate nisi qui.
              </p>
            </div>
          </div>
        </div>
        {/* card */}
      </div>
    </div>
    {/* card */}
  </div>
  {/* accordion style one */}
</>


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
