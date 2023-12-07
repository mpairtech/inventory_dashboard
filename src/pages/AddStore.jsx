import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const AddStore = () => {
  const navigate = useNavigate();

  const { userInfo } = useAuth();
  const [load, setLoad] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [number, setNumber] = useState("");
  const [manager, setManager] = useState("");
  const [location, setLocation] = useState("");

  const conditions = [
    storeName === "",
    number === "",
    manager === "",
    location === "",
  ];
  
  const fields = [
    "Store Name",
    "Contact No.",
    "Manager",
    "Location",
  ];


  const addStore = (e) => {
    e.preventDefault();
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i]) {
        // setLoader(false);
        toast.error(`Fill up the ${fields[i]} field!`);
        return false;
      }
    }
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    data.append("name", storeName);
    data.append("manager", manager);
    data.append("number", number);
    data.append("location", location);
    data.append("user_id", userInfo?.user_id);
    fetch(`${import.meta.env.VITE_SERVER}/authority/createStore`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res) {
          toast.success("Store added successfully");
          // setUpdate((prevUpdate) => prevUpdate + 1);
          navigate("/store");
        } else {
          toast.error("Failed to add Store");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while adding the Store");
      });
  };
  return (
    <div className="container-fluid overflow-x-hidden ">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2 min-vh-84">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 pt-2 fw-600 mb-0">Add Store</p>
              <p className="font-12 pb-2">Add New Store </p>
            </div>
            <div className="col-lg-10 px-0"></div>
          </div>
          <div className="row">
            <div className="col-lg-12 mb-2">
              <div className="card border">
                <div className="card-head">
                  <div className="row">
                    <div className="d-flex justify-content-center align-items-center ms-3">
                      <div className="row ">
                        <form
                          onSubmit={addStore}
                          id="formreset"
                          className="row"
                        >
                          <div className="col-lg-12">
                            <div className="px-0 border-0 rounded">
                              <h6 className="py-3 text-muted mid_font border-bottom font-14">
                                Store Information
                              </h6>
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Store Name
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Store name"
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setStoreName(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Store Location
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Store name"
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setLocation(e.target.value)}
                              />
                            </div>
                          </div>


                          <div className="col-lg-6">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Manager
                              </label>
                              <input
                                type="text"
                                placeholder="Manager name"
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setManager(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="mb-1 text-muted">
                              <label className="form-label addempfont">
                                Contact No.
                              </label>
                              <input
                                type="number"
                                placeholder="Enter Contact no"
                                className="form-control py-2 font-13 shadow-none"
                                onChange={(e) => setNumber(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-12 my-4">
                            <div className="text-end">
                              <button type="submit" className="btn_primary ">
                                {load ? (
                                  <div
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                  ></div>
                                ) : (
                                  "Add Store"
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
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

export default AddStore;
