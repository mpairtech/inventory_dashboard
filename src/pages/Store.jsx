import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const Store = () => {
  const [data, setData] = useState([]);
  const { userInfo } = useAuth();
  const getAllStore = () => {
    const data = new FormData();
    data.append("org_id", userInfo?.organizationData?.org_id);
    fetch(`${import.meta.env.VITE_SERVER}/authority/getAllStoreForOrg`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAllStore();
  }, []);
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 bg-white rounded-2">
          <div className="row mt-2">
            <div className="col-lg-2 ps-4">
              <p className="fs-5 pt-2 fw-600 mb-0 ">Store List</p>
              <p className="font-12 text-muted mb-2">
                Stores are listed by order
              </p>
            </div>
            <div className="col-lg-8 px-0"></div>
            <div className="col-lg-2 mt-3 ps-4">
              <Link to="/add-store" className="btn_primary py-2 ">
                + Add New Store
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card border">
                <div className="card-head">
                </div>
                <div className="card-body" style={{ minHeight: "68vh" }}>
                  <div className="row">
                    {data?.map((item) => (
                      <div
                        key={item?.store_id}
                        className="col-lg-3 col-md-6 col-12 mb-3 "
                      >
                        <div className="card bg-light rounded border-1 border-secondary">
                          <div className="card-body p-4">
                            <span
                              className={`badge rounded-pill float-md-end mb-3 mb-sm-0 ${item?.status == 1 ? "pos-orange" : "pos-red"
                                }`}
                            >
                              {item?.status == 1 ? "Active" : "Inactive"}
                            </span>
                            <h5>{item?.name}</h5>
                            <div className="mt-3">
                              <span className="text-muted d-block">
                                <i className="fa fa-user" aria-hidden="true" />
                                <a
                                  href="#"
                                  target="_blank"
                                  className="text-muted ms-1"
                                >
                                  {item?.manager}
                                </a>
                              </span>
                              <span className="text-muted d-block">
                                <i
                                  className="fa fa-map me-1"
                                  aria-hidden="true"
                                />
                                {item?.location}
                              </span>
                            </div>
                            <div className="mt-4 text-end">
                              <Link
                                to={`/store/${item?.store_id}`}
                                className="btn_primary "
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default Store;
